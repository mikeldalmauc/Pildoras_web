# Usar una imagen base de PHP con Apache
FROM php:8.2-apache

# Instalar dependencias necesarias
RUN apt-get update && apt-get install -y \
    zip unzip git libzip-dev libpng-dev libonig-dev libxml2-dev curl npm \
    && docker-php-ext-install \
    pdo_mysql mbstring exif bcmath gd opcache

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Configurar Xdebug solo en desarrollo (opcional)
ARG APP_ENV=production
RUN if [ "$APP_ENV" = "local" ] ; then pecl install xdebug && docker-php-ext-enable xdebug; fi

# Configurar el directorio de trabajo
WORKDIR /var/www/html

# Copiar archivos del proyecto
COPY . .

# Instalar dependencias de Laravel
RUN composer install --optimize-autoloader
# RUN composer install --no-dev --no-interaction --no-progress --no-suggest --optimize-autoloader

# Install Node.js dependencies
RUN npm install

# Build the assets
RUN npm run build

# Configure the Laravel application
RUN cp .env.example .env
RUN php artisan key:generate
#RUN php artisan optimize
#RUN php artisan storage:link

# Exponer el puerto para Apache
EXPOSE 8080

CMD ["/bin/bash", "/var/www/laravel/entrypoint.sh"]