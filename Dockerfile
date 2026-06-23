FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

ENV DATA_DIR=/app/data
ENV OWNER_PORT=3000
ENV PUBLIC_PORT=3001
ENV NODE_ENV=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/src/data/defaultProfile.js ./src/data/defaultProfile.js

EXPOSE 3000 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health >/dev/null && wget -qO- http://127.0.0.1:3001/health >/dev/null || exit 1

CMD ["node", "server/server.js"]
