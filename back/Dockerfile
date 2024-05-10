FROM python:3.11-slim

ENV DEBIAN_FRONTEND=noninteractive

COPY ./requirements.txt /back/requirements.txt

RUN apt-get update && apt-get install -y libpq-dev python3-dev
RUN pip install --no-cache-dir -r /back/requirements.txt

COPY . /back

EXPOSE 8000

WORKDIR /back

CMD ["sh", "-c", "python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8000"]


