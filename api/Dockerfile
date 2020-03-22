FROM python:3.7-alpine3.8

RUN mkdir /code || true
RUN mkdir /code/plantsale || true

RUN apk add --no-cache --virtual .build-deps gcc libc-dev make \
    && apk update && apk add postgresql-dev gcc python3-dev musl-dev \
    && pip install psycopg2-binary \
    && pip install uvicorn gunicorn \
    && echo "Done"

WORKDIR /code/plantsale
ADD requirements.txt /code/plantsale
RUN pip -q install -r requirements.txt


ADD . /code/plantsale

# Cleanup
RUN apk del .build-deps gcc libc-dev make \
    && find . -name \*.pyc -delete \
    && find . -name "*.py" -exec chmod 555 {} \;

EXPOSE 80
CMD gunicorn -w 2 -t 30 -b 0.0.0.0:80 --log-level=debug --name plantsale plantsale.wsgi
