# Stage 1: Build the React app
FROM node:16-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the built React app from the previous stage to the Nginx HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration file (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 to access the app
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
