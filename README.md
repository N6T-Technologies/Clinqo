![Logo](https://cdn.pixabay.com/photo/2013/07/18/10/59/heartbeat-163709_1280.jpg)

# Clinqo Queue Management

## Authors

-   [@meru45](https://www.github.com/meru45)

## Run Locally

Install Docker

```bash
  https://www.docker.com/
```

Clone the project

```bash
  git clone https://github.com/N6T-Technologies/Clinqo.git
```

Go to the project directory

```bash
  cd Clinqo
```

Setup env variables as directed in env.example

```bash
  Clinqo/apps/hospital-client/env.example
  Clinqo/apps/packages/db/env.example
```

move to Clinqo/packages/db/prisma

```bash
  yarn prisma generate
  yarn prisma migrate
```

Run postgres in docker container

```bash
  docker run --name postgres-container -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydatabase -p 5432:5432 -d postgres
```

Run redis-stack in docker container

```bash
  docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

Run Clinqo/apps/ws

```bash
  yarn run dev
```

Run Clinqo/apps/shefu

```bash
  yarn run dev
```

Run Clinqo/apps/hospital-client

```bash
  yarn run dev
```
