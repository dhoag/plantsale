FROM nginx:1.9.9

RUN apt-get update -q && \
    apt-get install -q -y curl vim git && \ 
    curl -L https://nodejs.org/dist/v4.2.3/node-v4.2.3-linux-x64.tar.gz > node.tar.gz && \
    tar -zxf node.tar.gz && rm node.tar.gz && node-v4.2.3-linux-x64/bin/npm install npm -g && \
    ln -s /node-v4.2.3-linux-x64/bin/* /usr/local/bin/ && apt-get clean

RUN npm install -g bower gulp less  && ln -s /node-v4.2.3-linux-x64/bin/bower /usr/local/bin/bower && \
    ln -s /node-v4.2.3-linux-x64/bin/gulp /usr/local/bin/gulp && \
    ln -s /node-v4.2.3-linux-x64/bin/lessc /usr/local/bin/lessc 

ADD . /home/app
WORKDIR /home/app
RUN bower --allow-root install
ADD site.conf /etc/nginx/conf.d/default.conf
RUN ./core.sh
EXPOSE 8080 80
