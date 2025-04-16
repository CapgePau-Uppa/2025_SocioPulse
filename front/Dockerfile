# Utiliser l'image officielle de Node.js
FROM node:22

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Installer l'Angular CLI globalement
RUN npm install -g @angular/cli

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Supprimer le dossier node_modules s'il existe
RUN rm -rf node_modules

# Nettoyer le cache de npm
RUN npm cache clean --force

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port 4200
EXPOSE 4200

# Démarrer l'application Angular
CMD ["ng", "serve", "--host", "0.0.0.0"]
