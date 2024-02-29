FROM python:3.11

RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice \
    unoconv \
    && rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt /celery_app/requirements.txt

RUN pip3 install --no-cache-dir -r celery_app/requirements.txt

COPY . /celery_app

WORKDIR /celery_app

CMD ["sh", "-c", "celery -A tasks worker -l info", "-Q", "celery"]