FROM node:18-alpine as build-stage

ARG VITE_APP_MODE
ENV VITE_APP_MODE=$VITE_APP_MODE

RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

FROM caddy:2.7.5-alpine as production-stage

COPY --from=build-stage /app/dist /srv