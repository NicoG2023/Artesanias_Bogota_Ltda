# Use the official Node.js Alpine image
FROM node:alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Install nodemon globally (opcional)
RUN npm install -g nodemon

# Copy the rest of the application code
COPY . .

# Expose the application's port
EXPOSE 3000

# Command to start the application
CMD ["npm", "run", "serve"]
