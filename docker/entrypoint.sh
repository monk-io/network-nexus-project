#!/bin/sh
set -eu

# Generate /usr/share/nginx/html/env.js from env.template.js if envsubst is available.
# nginx:alpine includes busybox; envsubst is provided by gettext.
# If it's missing, we simply skip runtime env generation.

HTML_DIR="/usr/share/nginx/html"
TEMPLATE="$HTML_DIR/env.template.js"
OUT="$HTML_DIR/env.js"

if command -v envsubst >/dev/null 2>&1; then
  if [ -f "$TEMPLATE" ]; then
    envsubst < "$TEMPLATE" > "$OUT"
  fi
else
  # best-effort fallback: copy template without substitution
  if [ -f "$TEMPLATE" ] && [ ! -f "$OUT" ]; then
    cp "$TEMPLATE" "$OUT"
  fi
fi

exec "$@"