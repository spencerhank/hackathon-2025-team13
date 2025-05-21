FROM nginx:alpine

# Install htpasswd utility
RUN apk add --no-cache apache2-utils

# Create the .htpasswd file (replace 'user' and 'password' with your credentials)
RUN htpasswd -bc /etc/nginx/.htpasswd username password

# Copy your custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist /usr/share/nginx/html