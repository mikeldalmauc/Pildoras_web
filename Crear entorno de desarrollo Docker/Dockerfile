FROM php:8.3-fpm-alpine

# Set working directory
WORKDIR /var/www/html

# Install additional packages
RUN apk update && apk --no-cache add \
    nginx \
    supervisor \
    zip unzip git libzip-dev libpng-dev libjpeg-turbo-dev libwebp-dev libxpm-dev freetype-dev \
    oniguruma-dev \
    autoconf gcc g++ make linux-headers \
    nodejs npm \
    && docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
        --with-webp \
    && docker-php-ext-install \
    pdo_mysql mbstring exif gd opcache \
    && docker-php-ext-enable opcache

    
# Instalar Xdebug para depuración
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

# Configurar Xdebug
COPY conf.d/xdebug/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy Nginx configuration
COPY conf.d/nginx/default.conf /etc/nginx/nginx.conf

# Copy PHP configuration
COPY conf.d/php-fpm/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf
COPY conf.d/php/php.ini /usr/local/etc/php/conf.d/php.ini
COPY conf.d/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# Copy Supervisor configuration
COPY conf.d/supervisor/supervisord.conf /etc/supervisord.conf

# Create application directory if it doesn't exist
RUN mkdir -p /var/www/html

# Copy Laravel application files
COPY . .

# Set up permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage

# Scheduler setup

# Create a log file
RUN touch /var/log/cron.log

# Add cron job directly to crontab
RUN echo "* * * * * /usr/local/bin/php /var/www/html/artisan schedule:run >> /var/log/cron.log 2>&1" | crontab -

# Expose ports
EXPOSE 80

# Add entrypoint script
ADD entrypoint.sh ./entrypoint.sh

# Make entrypoint executable
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
