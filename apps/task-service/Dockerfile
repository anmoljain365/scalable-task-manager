# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate

# Copy rest of the application
COPY . .

# Expose port
EXPOSE 4002

# Run the service using ts-node-dev
CMD ["sh", "./docker-entrypoint.sh"]