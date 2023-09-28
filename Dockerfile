FROM node:18-alpine As development

ENV NODE_ENV development
WORKDIR /app
RUN apk add --no-cache bash postgresql-client

COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
USER node
CMD ["/bin/sh", "scripts/start_webapi.sh"]