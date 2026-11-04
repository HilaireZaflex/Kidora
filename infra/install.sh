#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
# Development only. Existing checkout, local configuration and database are preserved.
export LOCAL_UID="$(id -u)" LOCAL_GID="$(id -g)"
docker compose build api
test -f apps/api/.env || cp apps/api/.env.example apps/api/.env
# Prefer official Git sources: api.github.com archives may be blocked in cloud sessions.
trust_bundle="${CODEX_PROXY_CERT:-/etc/ssl/certs/ca-certificates.crt}"
docker compose run --rm --no-deps \
  --volume "$trust_bundle:/run/proxy-ca.pem:ro" \
  -e COMPOSER_CAFILE=/run/proxy-ca.pem -e GIT_SSL_CAINFO=/run/proxy-ca.pem \
  -e COMPOSER_HOME=/tmp/composer api composer install --prefer-source --no-interaction --no-progress
if ! grep -q '^APP_KEY=base64:' apps/api/.env; then
  docker compose run --rm --no-deps api php artisan key:generate --no-interaction
fi
docker compose up -d db
docker compose run --rm api php artisan migrate --no-interaction
docker compose run --rm api php artisan db:seed --no-interaction
npm ci
npm --prefix apps/web ci
npm run build
