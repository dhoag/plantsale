FROM ubuntu:trusty

RUN mkdir /code || true
RUN mkdir /code/plantsale || true
WORKDIR /code/plantsale

RUN apt-get update -qq && \
    apt-get install -y -qq socat git python-pip python-psycopg2 libpq-dev \
    python2.7-dev gunicorn g++ make python-dev > /dev/null && \
    apt-get clean > /dev/null && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ADD requirements.txt /code/plantsale
RUN pip -q install -r requirements.txt

RUN locale-gen "en_US.UTF-8"
ENV LC_ALL en_US.UTF-8
ADD . /code/plantsale

# Cleanup
RUN apt-get clean > /dev/null && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
RUN find . -name \*.pyc -delete
RUN find . -name "*.py" -exec chmod 555 {} \;

EXPOSE 80
CMD gunicorn -w 2 -t 30 -b 0.0.0.0:80 --log-level=debug --name plantsale plantsale.wsgi
