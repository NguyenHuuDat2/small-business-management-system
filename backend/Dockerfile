FROM php:8.2-cli

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    zip \
    libpq-dev \
 && docker-php-ext-install pdo pdo_pgsql zip \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist --no-scripts

COPY . .

RUN php artisan package:discover --ansi

CMD ["sh", "-c", "php artisan optimize:clear && php artisan serve --host=0.0.0.0 --port=${PORT:-10000}"]