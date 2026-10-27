export async function up(db) {
  await db.schema.createTable('platform_customer_deletions', t => {
    t.uuid('id').primary(); t.uuid('tenant_id').notNullable().references('id').inTable('platform_tenants').onDelete('CASCADE');
    t.uuid('user_id').notNullable().references('id').inTable('platform_customers').onDelete('CASCADE');
    t.string('state').notNullable().defaultTo('pending'); t.string('pending_reason'); t.timestamp('eligible_at', { useTz: true });
    t.uuid('requested_by'); t.timestamp('requested_at', { useTz: true }).notNullable().defaultTo(db.fn.now()); t.timestamp('purged_at', { useTz: true });
    t.unique(['tenant_id', 'user_id']);
  });
}
export async function down() { throw new Error('Destructive rollback is disabled. Restore a verified backup using the migration runbook.'); }
