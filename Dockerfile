# Copyright 2021 Adevinta

FROM node:9-slim as builder

WORKDIR /app

ADD package-lock.json .
ADD package.json .

RUN npm install

ADD . .

RUN npm run-script build

FROM nginxinc/nginx-unprivileged:alpine

ARG BUILD_RFC3339="1970-01-01T00:00:00Z"
ARG COMMIT="local"

ENV BUILD_RFC3339 "$BUILD_RFC3339"
ENV COMMIT "$COMMIT"

COPY --from=builder /app/dist /usr/share/nginx/html

WORKDIR /app

COPY run.sh .
COPY config.json .

CMD ["./run.sh"]
