FROM node:18

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances en ignorant les dépendances optionnelles
RUN npm install --ignore-scripts

# Copier le reste de l'application
COPY . .

# Exposer le port sur lequel l'application va tourner
EXPOSE 4200

# Commande pour démarrer l'application
CMD ["npm", "start"]
