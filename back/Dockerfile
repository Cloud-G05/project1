FROM python:3.11

# RUN apt-get update \
#     && apt-get install -y curl git python3.11 python3-pip

COPY ./requirements.txt /back/requirements.txt

RUN pip3 install --no-cache-dir -r /back/requirements.txt

COPY . /back

EXPOSE 8000

WORKDIR /back

CMD ["sh", "-c", "python3 -m uvicorn src.main:app --host 0.0.0.0 --port 8000"]


