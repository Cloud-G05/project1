FROM ubuntu

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get upgrade -y

RUN apt-get install -y python3.11 python3-pip

RUN apt-get update && apt-get upgrade -y

# Install dependencies
RUN apt-get install -y libreoffice unoconv && \
    pip3 install unoconv


COPY ./requirements.txt /celery_app/requirements.txt

# Instalar psycopg2-binary
RUN apt install libpq-dev python3-dev -y

RUN pip3 install --no-cache-dir -r celery_app/requirements.txt

COPY . /celery_app

WORKDIR /celery_app

CMD ["python3","tasks.py"]