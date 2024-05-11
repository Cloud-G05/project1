FROM python:3.11-slim

ENV DEBIAN_FRONTEND=noninteractive

COPY ./requirements.txt /worker/requirements.txt

# Instalar psycopg2-binary
RUN apt-get update && apt-get install -y libpq-dev python3-dev

RUN pip install --no-cache-dir -r worker/requirements.txt

COPY . /worker

WORKDIR /worker

CMD ["python","tasks.py"]