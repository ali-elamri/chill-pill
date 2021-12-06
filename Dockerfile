FROM node:16-alpine AS builder

WORKDIR /home/chill-pill

COPY package*.json ./

RUN npm ci

COPY . .

FROM builder AS development

FROM builder AS production

RUN npm run build