# Stage 1: Build the React application
FROM node:18.16-alpine as build
WORKDIR /app
COPY package.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build

# Stage 2: Serve the built React application using a lightweight web server
FROM nginx:alpine

# Remove the default NGINX configuration
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy the build output from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Use a custom NGINX configuration file (if needed)
# COPY nginx.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]