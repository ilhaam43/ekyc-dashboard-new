FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY ekyc-dashboard-new/package.json ./ekyc-dashboard-new/package.json
RUN npm ci --ignore-scripts
COPY . .
RUN npm run lint && npm test && npm run build
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*
RUN npm prune --omit=dev --ignore-scripts
ENV NODE_ENV=production TZ=Asia/Jakarta
USER node
EXPOSE 5301
CMD ["node", "ekyc-dashboard-new/server/index.js"]
