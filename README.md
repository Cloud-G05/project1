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

# project2

Project 2 explanation video: https://youtu.be/58Ea-bwE1oM

The repository contains both the project's backend and frontend, in the back and front directories, respectively. On the other hand, there's a celery_app directory, which contains the code for the Celery application that is used to convert files.

Each directory has its own Dockerfile. These are used to build independents Docker images.

## Build the application

To run the application, you will need to have Docker installed on your virtual machines in GCP. Additionally you have to download the images of each container and install Redis in VM2. To run the application you have to configure the postgreSQL database in Google CloudSQL and finally run via SSH connection the following commands:

To run the backend connect to SSH in VM1 (web-server) and run the following command:

```bash
sudo docker run -v /nfs/general/.env:/.env -v /nfs/general/uploads:/nfs/general/uploads -v /nfs/general/uploadsCopy:/nfs/general/uploadsCopy -v /nfs/general/results:/nfs/general/results -p 8000:8000 api
```

This commands is assuming that the .env file is in the shared folder of the NFS server (VM3). The uploads, uploadsCopy and results folders are also in the shared folder of the NFS server (VM3).

To run celery connect to SSH in VM2 (worker) and run the following command:

```bash
sudo docker run -v /nfs/general/.env:/.env -v /nfs/general/uploads:/nfs/general/uploads -v /nfs/general/uploadsCopy:/nfs/general/uploadsCopy -v /nfs/general/results:/nfs/general/results celery_app
```

Finally, to run the frontend connect to SSH in VM1 (web-server) and run the following command:

```bash
sudo docker run -p 3000:3000 frontend
```

## API documentation

The API was built using FastAPI. You can access the API documentation, created automatically using Swagger, by navigating to the following URL:

```bash
http://{external_IP_address_VM1}:8000
```

### Acclaration

If you want to try out the different services from Swagger, it's important to know that you must first log in. When you log in, the response will contain a token that you need to enter in the Authorize button. On the other hand, if you want to create a task, you first need to use the POST `/files/uploadfile` service where you will upload the file you want to convert. Then, you go to the POST `/tasks/` service where the input_file_path should be `/back/uploadsCopy/{file_name}` since that is the path where the file was uploaded in the POST `/files/uploadfile` service.

## Access the application

Once everything is running, you can access the application by opening a web browser and navigating to the following URL:

```bash
http://{external_IP_address_VM1}:3000
```

### Acclaration

To be able to visualize the update of the task status from UPLOADED to PROCESSED on the frontend, you need to reload the page necessarily (after celery has finished the conversion).

# project3

Project 3 explanation video: https://www.youtube.com/watch?v=H82aGJQmHQo

The repository contains both the project's backend and frontend, in the back and front directories, respectively. On the other hand, there's a worker directory, which contains the code for the worker that is used to convert files.

Each directory has its own Dockerfile. These are used to build independent Docker images.

## Build the application

To run the application, you will need to have Docker installed on your virtual machines in GCP. Additionally you have to download the images of each container. To run the application you have to configure the postgreSQL database in Google CloudSQL, the bucket in Google Cloud Storage and the topic and subscription in Google Cloud Pub/Sub.

To run the backend you should create an image of the disk of VM1 (web-server), then an instance template based on this disk's image and finally create an instance group that autoscales from 1 to 3 VMs and that has the following startup script:

```bash
sudo docker run -v /variables/.env:/.env -p 8000:8000 api
```

This commands is assuming that the .env file is in the folder variables in (VM1).
On the other hand, you should also configure a load balancer that points to the instance group, so that the requests are distributed among the VMs of the instance group.

To run the worker you should create an image of the disk of VM2 (worker), then an instance template based on this disk's image and finally create an instance group that autoscales from 1 to 3 VMs and that has the following startup script:

```bash
sudo docker run -v /variables/.env:/.env worker
```

This commands is assuming that the .env file is in the folder variables in (VM2).

Finally, to run the frontend connect to SSH in VM1 (web-server) and run the following command:

```bash
sudo docker run -p 3000:3000 frontend
```

## API documentation

The API was built using FastAPI. You can access the API documentation, created automatically using Swagger, by navigating to the following URL:

```bash
http://{load_balancer_IP_address}:80
```

### Acclaration

If you want to try out the different services from Swagger, it's important to know that you must first log in. When you log in, the response will contain a token that you need to enter in the Authorize button. On the other hand, if you want to create a task, you first need to use the POST `/files/uploadfile` service where you will upload the file you want to convert. Then, you go to the POST `/tasks/` service where the input_file_path should be `uploads/{file_name}` since that is the path where the file was uploaded in the POST `/files/uploadfile` service.

## Access the application

Once everything is running, you can access the application by opening a web browser and navigating to the following URL:

```bash
http://{external_IP_address_VM1}:3000
```

### Acclaration

To be able to visualize the update of the task status from UPLOADED to PROCESSED on the frontend, you need to reload the page necessarily (after celery has finished the conversion).
