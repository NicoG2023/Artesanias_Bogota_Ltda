# Usar la imagen oficial de Node.js en Alpine Linux
FROM node:alpine

# Establecer el directorio de trabajo en /app
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el código fuente a /app/src
COPY src/ ./src

# Establecer la variable de entorno NODE_PATH para incluir /app/node_modules
ENV NODE_PATH=/app/node_modules

# Exponer el puerto de la aplicación
EXPOSE 3000

# Establecer el directorio de trabajo a /app/src
WORKDIR /app/src

# Comando para iniciar la aplicación con nodemon
CMD ["npx", "nodemon", "--legacy-watch", "app.js"]
