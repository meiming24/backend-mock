## Installation
Ensure that the following tools are installed:

- Docker

The following are optional, but helpful:

- Node18

## Setup

Docker is used to create PostgreSQL, Node and Redis containers

Then, from this project, run:

```docker-compose
touch .env
cp example.env  .env
docker-compose build (build)
docker-compose up (up)
```
(build is optional, but will help avoid problems if old, incompatible images already exist with the same name)