# Dockerfile para el entorno de desarrollo en React
FROM node:14

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto 3000
EXPOSE 3000

# Iniciar la aplicación en modo de desarrollo
CMD ["npm", "start"]
