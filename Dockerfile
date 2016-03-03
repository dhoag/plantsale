FROM ubuntu:trusty

RUN mkdir /code || true

WORKDIR /code

ADD requirements.txt /code/

RUN apt-get update -qq && \
    apt-get install -y -qq socat git python-pip python-psycopg2 libpq-dev \
    python2.7-dev gunicorn g++ make python-dev > /dev/null && \
    git clone https://github.com/ztane/python-Levenshtein && \
        cd python-Levenshtein && python setup.py install && \
    apt-get clean > /dev/null && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN pip -q install -r requirements.txt

RUN locale-gen "en_US.UTF-8"
ENV LC_ALL en_US.UTF-8
ADD . /code/

WORKDIR /code/plantsale

EXPOSE 8080
ENTRYPOINT ["/code/next-tier/docker-bootstrap.sh"]
CMD gunicorn -w $NUM_WORKERS -t $TIMEOUT -b 0.0.0.0:8080 --log-syslog --log-level=debug --log-syslog-prefix $NAME --log-syslog-to udp://app_syslog:514 --name $NAME plantsale.wsgi
