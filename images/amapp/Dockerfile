FROM ubuntu
MAINTAINER pge "gpshun@163.com"

# Add application repository URL to the default sources
# RUN echo "deb http://archive.ubuntu.com/ubuntu/ raring main universe" >> /etc/apt/sources.list

RUN apt-get update -y
RUN apt-get install -y nginx
RUN mkdir -p /var/www/amapp
ADD amapp.conf /etc/nginx/conf.d/
ADD nginx.conf /etc/nginx/nginx.conf

# Append "daemon off;" to the beginning of the configuration
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

EXPOSE 80

# Set the default command to execute
# when creating a new container
CMD service nginx start
