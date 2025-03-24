# Use Node.js for building the app
FROM node:22 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Use Nginx for serving the static files
FROM nginx:alpine

# Copy custom Nginx config (this is the fix!)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy React build files to Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
