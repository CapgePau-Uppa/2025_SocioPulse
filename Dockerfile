# Utiliser une image de base avec Docker et Docker Compose installés
FROM tiangolo/docker-with-compose

# Copier le fichier docker-compose.yml dans le conteneur
COPY docker-compose.yml /usr/src/app/docker-compose.yml

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Commande pour démarrer les services avec Docker Compose
CMD ["docker-compose", "up", "--build"]
