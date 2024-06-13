# shout-messaging-api

## Setup

### Run the server

To start the service on the default port (3000): `npm start`

To use a specific port: `PORT=[value] npm start`
To modify the service root path (default is /): `ROOTPATH=[value] npm start`

### Run with Docker

Build the image: `docker build -t shout-messaging-api`

Run the container: `docker run --name shout-messaging-api -p [value]:3000 -d shout-messaging-api`
