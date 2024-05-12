FROM ubuntu

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get upgrade -y

RUN apt-get install -y python3 python3-pip

RUN apt-get update && apt-get upgrade -y

# Install dependencies
RUN apt-get install -y libreoffice unoconv && \
    pip3 install unoconv


COPY ./requirements.txt /worker/requirements.txt

# Instalar psycopg2-binary
RUN apt install libpq-dev python3-dev -y

RUN pip3 install --no-cache-dir -r worker/requirements.txt

COPY . /worker

WORKDIR /worker

CMD ["sh", "-c", "python3 -m uvicorn tasks:app --host 0.0.0.0 --port 8000"]