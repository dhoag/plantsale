FROM jwilder/nginx-proxy

ADD secret_key.conf /etc/nginx/main.d/secret_key.conf
ADD gzip_max.conf /etc/nginx/conf.d/gzip_max.conf
ADD nginx.tmpl /app/nginx.tmpl

RUN apt-get update -y && apt-get install -y curl && apt-get clean
EXPOSE 80 8080
