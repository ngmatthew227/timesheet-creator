# Stage 1: Build the React application
FROM node:18.16-alpine as build
WORKDIR /app
COPY package.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build

# Stage 2: Serve the built React application using a lightweight web server
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html