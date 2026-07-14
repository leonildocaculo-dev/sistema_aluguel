FROM serversideup/php:8.3-fpm-nginx

# Mudar para o utilizador root temporariamente para instalar pacotes adicionais, se necessário
USER root

# Instalar dependências de sistema para o Laravel/PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configurar variáveis de ambiente do servidor web
ENV WEB_DOCUMENT_ROOT=/var/www/html/public
ENV PHP_OPCACHE_ENABLE=1

# Voltar para o utilizador web
USER www-data

# Copiar os ficheiros do projeto
COPY --chown=www-data:www-data . /var/www/html

# Instalar dependências PHP
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Executar comandos de otimização do Laravel
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# Expor a porta 8080 (usada por omissão na imagem serversideup)
EXPOSE 8080
