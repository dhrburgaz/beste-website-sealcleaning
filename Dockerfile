# Sealcleaning-backend (Node 22, geen npm-afhankelijkheden). Zie docs/BACKEND.md.
FROM node:22-alpine
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8787 SEAL_DATA_DIR=/data SITE_ROOT=/app
WORKDIR /app
COPY package.json ./
COPY server ./server
COPY js ./js
COPY data ./data
COPY css ./css
COPY vendor ./vendor
COPY images/branding ./images/branding
COPY favicon.svg ./
RUN mkdir -p /data && chown node:node /data
USER node
VOLUME ["/data"]
EXPOSE 8787
HEALTHCHECK --interval=60s --timeout=5s CMD wget -qO- http://127.0.0.1:8787/api/health || exit 1
CMD ["node", "--disable-warning=ExperimentalWarning", "server/server.js"]
