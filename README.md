# project1

The repository contains both the project's backend and frontend, in the back and front directories, respectively. On the other hand, there's a celery_app directory, which contains the code for the Celery application that is used to send convert files.

Each directory has its own Dockerfile. These are used to build independents Docker images.

The construction of the images is automated using Docker Compose. The `docker-compose.yml` file contains the configuration for all services.

## Build the application

To run the application, you will need to have Docker and Docker Compose installed and opened on your machine. Then you can navigate to the project directory and use the following command in a Unix-like command prompt to build and run the application.

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

### Acclaration

If you want to try out the different services from Swagger, it's important to know that you must first log in. When you log in, the response will contain a token that you need to enter in the Authorize button. On the other hand, if you want to create a task, you first need to use the POST `/files/uploadfile` service where you will upload the file you want to convert. Then, you go to the POST `/tasks/` service where the input_file_path should be `/back/uploadsCopy/{file_name}` since that is the path where the file was uploaded in the POST `/files/uploadfile` service.

## Access the application

Once everything is running, you can access the application by opening a web browser and navigating to the following URL:

```bash
http://localhost:3000
```

### Acclaration

To be able to visualize the update of the task status from UPLOADED to PROCESSED on the frontend, you need to reload the page necessarily (after celery has finished the conversion).
