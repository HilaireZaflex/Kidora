#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
docker compose exec -T db psql -U kidora -d postgres -v ON_ERROR_STOP=1 < infra/test-db.sql
docker compose exec -T -e APP_ENV=testing -e DB_DATABASE=kidora_test api php artisan test
