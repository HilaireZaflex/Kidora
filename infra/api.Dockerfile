# syntax=docker/dockerfile:1
FROM composer:2 AS composer
FROM php:8.4-cli-bookworm
RUN --mount=type=secret,id=proxy_ca \
    if [ -f /run/secrets/proxy_ca ]; then cp /run/secrets/proxy_ca /usr/local/share/ca-certificates/session-proxy.crt; update-ca-certificates; fi; \
    apt-get update && apt-get install -y --no-install-recommends libpq-dev libonig-dev libxml2-dev libsqlite3-dev libzip-dev unzip git \
    && docker-php-ext-install -j2 pdo_pgsql pdo_sqlite mbstring dom xml xmlwriter zip \
    && rm -rf /var/lib/apt/lists/* /usr/local/share/ca-certificates/session-proxy.crt \
    && update-ca-certificates --fresh
COPY --from=composer /usr/bin/composer /usr/local/bin/composer
WORKDIR /app
EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000", "--no-reload"]
