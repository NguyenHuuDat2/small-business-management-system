FROM php:8.2-cli

WORKDIR /var/www

# Cài các package cần thiết
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    zip

# Cài PHP extensions
RUN docker-php-ext-install pdo pdo_mysql zip

# Cài composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy composer trước để cache layer
COPY composer.json composer.lock ./

RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Copy toàn bộ project
COPY . .

# Laravel permissions
RUN chmod -R 775 storage bootstrap/cache

# Optimize Laravel
RUN php artisan config:clear || true
RUN php artisan route:clear || true
RUN php artisan view:clear || true

EXPOSE 10000

CMD php artisan serve --host=0.0.0.0 --port=$PORT
