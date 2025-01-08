FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y lock (solo para instalar dependencias)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# (Opcional) Copiar el src para tenerlo en la imagen base 
# pero no es obligatorio si vas a usar un volumen
COPY public ./public
COPY src ./src

# Ambiente para forzar polling (opcional, si no lo manejas en docker-compose)
ENV CHOKIDAR_USEPOLLING=true

# Exponer el puerto (3000 por defecto)
EXPOSE 3000

# Correr el server de desarrollo
CMD ["npm", "start"]
