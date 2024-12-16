# Dockerfile para el entorno de desarrollo en React
FROM node:alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY public ./public
COPY src/ ./src

# Establecer la variable de entorno NODE_PATH para incluir /app/node_modules
ENV NODE_PATH=/app/node_modules

# Exponer el puerto 3000
EXPOSE 3000

# Establecer el directorio de trabajo a /app/src
WORKDIR /app/src

# Iniciar la aplicación en modo de desarrollo
CMD ["npm", "start", "--", "--watch"]
