FROM python:3.11

ENV DEBIAN_FRONTEND=noninteractive

# Install LibreOffice and unoconv
RUN apt-get update && apt-get install -y libreoffice unoconv

# Install additional dependencies
RUN apt-get install -y libpq-dev python3-dev

# Set working directory
WORKDIR /worker

# Copy requirements.txt and install dependencies
COPY ./requirements.txt /worker/requirements.txt
RUN pip3 install --no-cache-dir -r /worker/requirements.txt

# Copy the rest of the application
COPY . /worker

# Start the FastAPI application
CMD ["uvicorn", "tasks:app", "--host", "0.0.0.0", "--port", "8000"]
