'use strict'
import express from 'express';
import { Server } from 'socket.io';
import Rooms from './src/Rooms.js';
import Client from './src/Client.js';

// init web server
const app = express();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
	const host = server.address().address;
	const { port } = server.address();
	console.log(`Server listening at ${host}:${port}`);
});

// init socket.io
const rootPath = process.env.ROOTPATH || null;
console.log(`Root path is ${rootPath}`);
const io = new Server(server, {
	cors: {
		origin: "*" // todo: this is a bit of a security issue but we don't have to worry about it for now
	},
	path: rootPath
});

app.get(rootPath || '/', (req, resp) => {
	resp.send('shout-messaging-api');
});

io.on('connection', (socket) => {
	const { query } = socket.handshake;
	console.log(socket.handshake);

	console.log(`connected to ${socket.id}`);

	// create the room if it doesn't already exist
	const room = Rooms.getOrCreate(query.room);

	let success = false;

	socket.join(room.id);

	// add client to room
	console.log(`Client ${query.id} is connecting to room ${room.id}`);
	const client = new Client(socket, query.id, room);
	success = room.addClient(client);

	// notify client joined
	if (success) {
		// tell the room the client joined
		io.to(room.id).emit('client_joined', client, room);

		// tell the client they joined the room
		socket.emit('room_joined', room);
		console.log(`Client ${query.id} successfully joined room ${room.id}`)
	} else {
		// tell the client they failed to join
		socket.emit('room_join_failed');
		console.log(`Client ${query.id} failed to join room ${room.id}`)
		return;
	}

	// handle messages from client
	socket.on('message', (message, to, ...data) => {
		if (to) {
			console.log(`message ${message} to ${to}`, ...data)
			room.getClient(to)?.socket.emit('message', message, ...data);
		} else {
			// broadcast message to everyone in the room
			console.log(`message ${message} to room`, ...data)
			socket.to(room.id).emit('message', message, ...data);
		}
	});

	// handle disconnect
	socket.on('disconnect', (reason) => {
		console.log(`Client ${client.id} disconnected.`);
		room.removeClient(client.id);

		// tell the room the client left 
		io.to(room.id).emit('client_left', client, room);

		// room is empty, time to destroy
		console.log(`Room client count: ${room.clientCount}`)
		if (room.clientCount === 0) {
			console.log(`Room ${room.id} is empty. Destroying...`);
			Rooms.destroy(room.id);
		}
	})

	// log messages
	// socket.onAny((eventName, message) => console.log(`received ${eventName}: ${message}`));
});