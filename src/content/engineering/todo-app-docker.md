---
title: Todo App Docker
description: A project to containerize a Flask-based simple to-do app using Docker.
date: 2024-01-01
image: ./assets/overtime-system.png
categories: ['Docker', 'Dev Ops']
repo: https://github.com/mad4869/todo-app-docker
---
## Background Scenario

Imagine yourself as a software engineer who needs to deploy a Flask-based to-do web application and intends to utilize Docker for building an isolated container for the web app.

## Building Process

### 1. Build the Image of the Web App

The initial step involves creating a **Dockerfile** that consolidates the necessary steps to build a custom image of the web app.

```dockerfile
FROM python:3.10

LABEL version="1.0"

WORKDIR /todo-app

COPY requirements.txt .
RUN pip install -r requirements.txt

ENV FLASK_APP="run.py"
ENV FLASK_DEBUG=1
ENV ENVIRONMENT="development"
ENV POSTGRES_USER="postgres"
ENV POSTGRES_PORT="5432"

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install -y nodejs

COPY . .

RUN npm install

RUN flask digest compile

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]
```

Do not forget to set up an `.env` file in the root directory to store all the environmental variables required for the Flask app.

#### .env

```env
SECRET_KEY="some_secret_key"
JWT_SECRET_KEY="some_secret_key"
```

After setting up the `.env` file, the next step is to execute the `docker build` command:

```bash
docker build --no-cache -t todo-app:latest .
```

This command will build the Docker image based on the instructions provided in the Dockerfile and the context of the current directory.

<!-- ![Build a Docker image with Dockerfile](docs/docker-build.png) -->

This custom base image can also be pulled from the Docker Hub registry using `docker pull` command:

```bash
docker pull mad4869/todo-app:latest
```

<!-- ![Pull a Docker image from Docker Hub](docs/docker-pull-todo.png) -->

### 2. Pull the Postgres Image

Since the web app requires a database connection, we will be using the PostgreSQL base image. We can pull the image from the Docker registry using the `docker pull` command:

```bash
docker pull postgres:latest
```

<!-- ![Pull a Docker image from Docker Hub](docs/docker-pull-postgres.png) -->

### 3. Run the Containers

Now that we have obtained the required images, it's time to run the containers using the `docker run` command. While running the containers, we also need to set up the volume, network, ports, and environmental variables to ensure that both the Flask app and Postgres containers can work together seamlessly.

Let's create a new volume and network for both the Flask app and Postgres containers.

```bash
docker network create todo-network
```

```bash
docker volume create todo-volume
```

```bash
docker volume create postgres-volume
```

First, we run the PostgreSQL container with the following command:

```bash
docker run --name postgres-container -v postgres-volume --network todo-network -p 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_DB=todo-db -d postgres
```

In this command, the PostgreSQL container is named `postgres-container` We create a volume named `postgres-volume` to store the data. The container is connected to the `todo-network` network. Port **5432** is mapped from the container to the host machine. Adjust it if you have another service running in the same port. The environment variables `POSTGRES_PASSWORD` and `POSTGRES_DB` are set to `password` and `todo-db`, respectively. Adjust the values as per your requirements.

Next, we run the Flask app container with the following command:

```bash
docker run --name todo-app-container -v todo-volume --network todo-network -p 5000:5000 -e POSTGRES_PASSWORD=password -e POSTGRES_DB=todo-db -e POSTGRES_HOST=postgres-container -d todo-app
```

In this command, the Flask app container is named `todo-app-container` Port 5000 is mapped from the container to the host machine. The environment variables `POSTGRES_PASSWORD`, `POSTGRES_DB`, and `POSTGRES_HOST` are set to the values according to the Postgres setup.

To establish the connection between the Flask app and Postgres, we can use `docker exec` to run the necessary `flask db` commands inside the container:

```bash
docker exec todo-app-container flask db init
docker exec todo-app-container flask db migrate
docker exec todo-app-container flask db upgrade
```

<!-- ![Run docker containers](docs/docker-run.png) -->

And now, the Flask app will run inside the `todo-app-container` and establish a connection to the `postgres-container` as its database.

<!-- ![Accessing the web app in the port 5000](docs/browser.png) -->
_The Flask to-do app in the port 5000_

<!-- ![Checking connection to Postgres database in the port 5432 via dbeaver](docs/dbeaver.png) -->
_Postgres in the port 5432, inspected using dbeaver_

### 4. Run the Containers with Docker-Compose

Another option is to run the containers simultaneously using the `docker compose` command. To do this, we first need to create a `docker-compose.yml` file:

```yml
version: '3'
services:
  todo-app:
    image: todo-app:latest
    container_name: todo-app-container
    restart: always
    ports:
      - 5000:5000
    volumes:
      - todo-volume:/app/data
    command: flask run --host=0.0.0.0
    environment:
      - POSTGRES_HOST=postgres-container
      - POSTGRES_DB=todo-db
    env_file:
      - todo.env
    depends_on:
      - postgres
    networks:
      - todo-network
  postgres:
    image: postgres:latest
    container_name: postgres-container
    restart: always
    ports:
      - 5433:5432
    volumes:
      - postgres-volume:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_DB=todo-db
    env_file:
      - postgres.env
    networks:
      - todo-network
networks:
  todo-network:
    external: true
volumes:
  todo-volume:
    external: true
  postgres-volume:
    external: true
```

Inside the file, we configure all the components needed to run both containers, including the enviromental variables that are stored inside the `.env` files.

#### todo.env

```env
SECRET_KEY="some_secret_key"
JWT_SECRET_KEY="some_secret_key"
POSTGRES_PASSWORD="password"
```

#### postgres.env

```env
POSTGRES_PASSWORD="password"
```

If all the components are ready, we run the `docker compose` command:

```bash
docker compose up -d
```

<!-- ![Running containers using docker compose](docs/docker-compose.png) -->

If there are no issues during the running of the containers, we run the `flask db` commands inside the Flask app container:

```bash
docker exec todo-app-container flask db init
docker exec todo-app-container flask db migrate
docker exec todo-app-container flask db upgrade
```

## Backup and Restore

Once the containers are set up, it's important to create scripts for data backup and restoration.

The backup script will run as a **cron job** once a day and will generate backup data using `pg_dumpall` command.

### backup.sh

```sh
#!/bin/bash

BACKUP="path/to/backups/backup_$(date +%d-%m-%Y).sql"

docker exec postgres-container pg_dumpall -U postgres > "$BACKUP"
```

Setting up the cron:

```bash
crontab -e
```

```bash
0 0 * * * /home/user/path/to/backup.sh
```

<!-- ![Setting up cron job to backup database data](docs/crontab.png) -->
_cron job runs once a day every midnight_

In case of emergency where data needs to be restored, the backup data can be inserted into a running container and be executed to restore the missing data.

### insert_backup.sh

```sh
#!/bin/bash

BACKUP="path/to/backups/backup_$(date +%d-%m-%Y).sql"

docker cp "$BACKUP" postgres-container:/var/backups
```

#### insert backup data to a running postgres container

### restore.sh

```sh
#!/bin/bash

BACKUP="/var/backups/backup_$(date +%d-%m-%Y).sql"

docker exec postgres-container psql -U postgres -d todo-db -f "$BACKUP"
```

#### execute the command to restore data inside a running postgres container

## Conclusion

That concludes the overview of the process for building Docker containers for a Flask web application and PostgreSQL. We have the option to run them separately and establish the connection between them, or we can run them simultaneously using `docker-compose`. Additionally, it is important to implement a backup and restore mechanism to ensure data integrity in case of any issues or data loss.
