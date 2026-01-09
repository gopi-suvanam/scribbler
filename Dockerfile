# Use nginx:alpine as the base image - lightweight and efficient
FROM nginx:alpine

# Copy all application files to nginx's default serving directory
COPY . /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# nginx runs in foreground by default, no CMD needed