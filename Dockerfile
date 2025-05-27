# Use official Node.js 22 image with Alpine (lighter weight)
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install production dependencies only (no devDependencies)
RUN npm install --only=production

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 3000

# Use node directly to run the built application (more efficient than 'nest start')
CMD ["node", "dist/main"]