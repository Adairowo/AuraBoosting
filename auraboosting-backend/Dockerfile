# Imagen oficial de PHP 8.2 con Apache
FROM php:8.2-apache

# Dependencias del sistema necesarias para Laravel (pdo_mysql, zip, etc.)
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
  && docker-php-ext-install pdo pdo_mysql zip \
  && a2enmod rewrite \
  && rm -rf /var/lib/apt/lists/*

# Configurar Apache para que apunte a /public
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
 && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Carpeta de trabajo
WORKDIR /var/www/html

# Copiar primero composer para aprovechar cache
COPY composer.json composer.lock ./

# Instalar dependencias PHP (prod)
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Copiar el resto del proyecto
COPY . .

# Permisos para storage y cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Cache de configuración (si APP_KEY existe en runtime, esto puede fallar).
# En Render suele convenir hacerlo en el start script, pero lo dejamos "safe" aquí.
# Si te falla el build por APP_KEY, comenta estas líneas.
RUN php artisan config:clear || true \
 && php artisan route:clear || true \
 && php artisan view:clear || true

# Render expone el puerto vía $PORT; Apache por defecto escucha 80.
# Para que funcione en Render, necesitamos que Apache escuche en $PORT.
# Lo resolvemos con un script de arranque.
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
