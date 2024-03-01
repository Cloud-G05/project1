# project1

The repository contains both the project's backend and frontend, in the back and front directories, respectively. On the other hand, there's a celery_app directory, which contains the code for the Celery application that is used to send convert files.

Each directory has its own Dockerfile. These are used to build independents Docker images.

The construction of the images is automated using Docker Compose. The `docker-compose.yml` file contains the configuration for all services.

## Build the application

To run the application, you will need to have Docker and Docker Compose installed on your machine. Then you can navigate to the project directory and use the following command in a Unix-like command prompt to build and run the application.

```bash
sudo docker pull postgres;sudo docker pull redis;sudo docker pull ubuntu;sudo docker-compose up
```

In a Windows command prompt, which must be ran as an administrator, you can use the following command:

```bash
docker pull postgres && docker pull redis && docker pull ubuntu && docker-compose up
```

## API documentation

The API was built using FastAPI. You can access the API documentation, created automatically using Swagger, by navigating to the following URL:

```bash
http://localhost:8000
```

## Access the application

Once everything is running, you can access the application by opening a web browser and navigating to the following URL:

```bash
http://localhost:3000
```
