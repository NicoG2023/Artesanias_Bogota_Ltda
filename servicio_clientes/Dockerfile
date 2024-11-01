# Usa una imagen base de Node.js
FROM node:18

# Crea el directorio de trabajo en el contenedor
WORKDIR /app

# Copia package.json y yarn.lock al contenedor
COPY package*.json yarn.lock ./

# Instala las dependencias y nodemon globalmente
RUN npm install && npm install -g nodemon

# Copia el código fuente de la aplicación
COPY . .

# Expone el puerto (cambia el puerto si cada servicio usa uno diferente)
EXPOSE 3000

# Comando para iniciar el servicio con nodemon
CMD ["nodemon", "app.js"]
