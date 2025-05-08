# Utiliser l'image officielle de PHP 8.2
FROM php:8.2-fpm

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    netcat-openbsd

# Installer les extensions PHP nécessaires pour Laravel
RUN docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Définir le répertoire de travail dans le conteneur
WORKDIR /var/www/html

# Copier d'abord les fichiers de dépendances
COPY composer.json composer.lock ./

# Installer les dépendances Composer
RUN composer install --prefer-dist --no-scripts --no-dev --no-autoloader

# Copier le reste des fichiers du projet
COPY . .

# Finaliser l'installation de composer
RUN composer dump-autoload --optimize

# Copier le fichier .env.example en .env s'il n'existe pas déjà
RUN if [ ! -f ".env" ]; then cp .env.example .env; fi

# Générer la clé de l'application Laravel
RUN php artisan key:generate

# Définir les permissions appropriées
RUN chown -R www-data:www-data \
    /var/www/html/storage \
    /var/www/html/bootstrap/cache

# Exposer le port 8000
EXPOSE 8000

# Script d'entrée pour lancer le serveur
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]