FROM php:8.2-apache

# Install required PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Enable mod_rewrite
RUN a2enmod rewrite

# Configure Apache to allow .htaccess overrides
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Create user vscode with www-data group and home directory
RUN useradd -m -d /home/vscode -s /bin/bash -g www-data vscode

# Set correct permissions
RUN chown -R vscode:www-data /home/vscode
RUN chown -R vscode:www-data /var/www/html

# Set working directory
WORKDIR /var/www/html
