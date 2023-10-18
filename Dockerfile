FROM node:18-alpine as build-stage

# Accept the build arguments for VITE environment variables
ARG VITE_APP_MODE
ARG VITE_BASE_URL
ARG VITE_BASE_PATH

# Set the build arguments as environment variables
ENV VITE_APP_MODE=$VITE_APP_MODE
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_BASE_PATH=$VITE_BASE_PATH


RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

FROM caddy:2.7.5-alpine as production-stage

COPY --from=build-stage /app/dist /srv