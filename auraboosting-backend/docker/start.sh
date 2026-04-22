#!/usr/bin/env bash
set -e

# Render define $PORT (ej: 10000). Apache debe escuchar ahí.
: "${PORT:=80}"

# Cambiar Apache de 80 a $PORT
sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/:80/:${PORT}/" /etc/apache2/sites-available/000-default.conf

# Laravel storage link (no rompe si ya existe)
php artisan storage:link || true

# Limpiar caches viejos antes de regenerar (evita arrastrar APP_KEY antigua o vacía)
php artisan optimize:clear || true

# Validar APP_KEY en runtime para evitar 500 silencioso
if [ -z "${APP_KEY:-}" ]; then
	echo "ERROR: APP_KEY no está definida en variables de entorno"
	exit 1
fi

# Si usas migraciones automáticas (opcional; cuidado en producción)
# php artisan migrate --force

# Cachear config/routes si el env está completo (opcional)
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Arrancar Apache en foreground
apache2-foreground