FROM nginx:1.13.9

RUN apt-get update -q && \
    apt-get install -q -y curl vim git
RUN curl -L https://nodejs.org/dist/v8.10.0/node-v8.10.0-linux-x64.tar.gz > node.tar.gz && \
    tar -zxf node.tar.gz && rm node.tar.gz && ln -s /node-v8.10.0-linux-x64/bin/* /usr/local/bin/ && \
    apt-get clean > /dev/null && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN npm install -g bower gulp less && \
    ln -s /node-v8.10.0-linux-x64/bin/bower /usr/local/bin/bower && \
    ln -s /node-v8.10.0-linux-x64/bin/gulp /usr/local/bin/gulp && \
    ln -s /node-v8.10.0-linux-x64/bin/lessc /usr/local/bin/lessc 

#RUN chmod -R og+X /var
RUN useradd -r -u 1001  --create-home --user-group web 
USER web
ADD --chown=web . /home/app
WORKDIR /home/app
RUN bower install
ADD site.conf /etc/nginx/conf.d/default.conf
RUN ./core.sh
USER root
EXPOSE 8080 80
