FROM php:8.2-cli

WORKDIR /var/www

# Cài extension cần thiết
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    zip \
    curl

RUN docker-php-ext-install pdo pdo_mysql zip

# Cài composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy toàn bộ project trước
COPY . .

# Cài dependency
RUN composer install --no-dev --optimize-autoloader

# Generate key
RUN php artisan key:generate

# Chạy Laravel
CMD php artisan serve --host=0.0.0.0 --port=10000