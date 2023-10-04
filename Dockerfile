# Copyright 2021 Adevinta

FROM node:20-slim as builder

RUN apt install --update python3
ENV PYTHON=/usr/bin/python3

WORKDIR /app

COPY package*.json ./

RUN npm install --python=python3

COPY . .

RUN npm run-script build

FROM builder as dev

# Node:9-slim is unable to add packages so we are using a node package instead.
RUN npm install -g envsub

# Set a default value for preserve envsub command to generate a valid config.json.
ENV TEAMS_CRUD=true

CMD [ "npm", "run", "serve"]

FROM nginxinc/nginx-unprivileged:1.25-alpine-slim

ARG BUILD_RFC3339="1970-01-01T00:00:00Z"
ARG COMMIT="local"

ENV BUILD_RFC3339 "$BUILD_RFC3339"
ENV COMMIT "$COMMIT"

COPY --chown=nginx --from=builder /app/dist /usr/share/nginx/html

WORKDIR /app
COPY --chown=nginx run.sh .
COPY --chown=nginx config.json .

CMD ["./run.sh"]
