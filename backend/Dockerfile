# Use the official Node.js image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy only package.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy all project files
COPY . .

# Expose the port
EXPOSE 3000

# Run with nodemon
CMD ["nodemon", "index.js"]