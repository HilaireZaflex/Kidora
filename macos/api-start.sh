#!/usr/bin/env bash
set -euo pipefail
cd /app
if [ ! -f .env ]; then
  cp .env.example .env
  chmod 600 .env
fi
# Official archives are used on the Mac; source installations already present are retained.
composer install --prefer-dist --no-interaction --no-progress
if ! grep -q '^APP_KEY=base64:' .env; then
  php artisan key:generate --no-interaction
fi
php artisan migrate --no-interaction
if [ ! -f storage/app/.macos-demo-initialized ]; then
  php artisan db:seed --no-interaction
  mkdir -p storage/app
  touch storage/app/.macos-demo-initialized
fi
# Preserve Docker Compose configuration in the PHP server subprocess.
exec php artisan serve --host=0.0.0.0 --port=8000 --no-reload
