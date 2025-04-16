# Utiliser l'image officielle de PHP 8.2
FROM php:8.2-fpm

# Installer les extensions nécessaires pour Laravel
RUN docker-php-ext-install pdo pdo_mysql

# Installer Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Définir le répertoire de travail dans le conteneur
WORKDIR /var/www/html

# Copier les fichiers du projet dans le conteneur
COPY . .

# Installer les dépendances Composer
RUN composer install

# Copier le fichier .env.example en .env
COPY .env.example .env

# Générer la clé de l'application Laravel
RUN php artisan key:generate

# Exposer le port 9000
EXPOSE 8000

# Démarrer PHP-FPM
CMD ["php-fpm"]
