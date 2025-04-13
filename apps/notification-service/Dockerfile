# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the application
COPY . .

# Expose port
EXPOSE 4003

# Run the service using ts-node-dev
CMD ["npx", "ts-node-dev", "--respawn", "src/server.ts"]