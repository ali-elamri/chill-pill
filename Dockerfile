# STAGE 1
FROM node:16-alpine as builder

RUN mkdir -p /home/chill-pill/node_modules && chown -R node:node /home/chill-pill

WORKDIR /home/chill-pill

COPY --chown=node:node package*.json ./

USER node

RUN npm ci

COPY --chown=node:node . .

FROM builder AS development

FROM builder AS production

USER node

RUN npm run build