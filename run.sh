#!/bin/sh

# Copyright 2021 Adevinta

# Default docs and contact env variables values
export UI_DOCS_API_LINK=${UI_DOCS_API_LINK:-/}
export UI_DOCS_WHITELISTING_LINK=${UI_DOCS_WHITELISTING_LINK:-/}
export UI_DOCS_DISCOVERY_LINK=${UI_DOCS_DISCOVERY_LINK:-/}
export UI_DOCS_AUDITROLE_LINK=${UI_DOCS_AUDITROLE_LINK:-/}
export UI_CONTACT_EMAIL=${UI_CONTACT_EMAIL:-}
export UI_CONTACT_SLACK=${UI_CONTACT_SLACK:-/}

# Apply env variables
envsubst < config.json > /usr/share/nginx/html/config.json
envsubst < /usr/share/nginx/html/index.html | tee /usr/share/nginx/html/index.html
envsubst < /usr/share/nginx/html/assets/index.html | tee /usr/share/nginx/html/assets/index.html

if echo "$PORT" | grep -Eq '[0-9]+'; then
  sed -i "s/^[[:space:]]\+listen .*/    listen $PORT;/g" /etc/nginx/conf.d/default.conf
fi

exec nginx -g 'daemon off;'
