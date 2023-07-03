FROM node:18-alpine as build-stage
RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

FROM nginx:stable-alpine as production-stage
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]