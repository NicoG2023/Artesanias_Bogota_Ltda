# Usar la imagen oficial de Node.js en Alpine Linux
FROM node:alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Definir NODE_ENV y establecer `development` como valor predeterminado
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies en modo desarrollo)
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación con nodemon
CMD ["npx", "nodemon", "--legacy-watch", "app.js"]
