export default class Room {
	constructor(id) {
		this.id = id;
		this.clients = {};
		this.clientCount = 0;
	}

	addClient(client) {
		// client is already in the room
		if (this.clients[client.id]) {
			return false;
		}

		this.clients[client.id] = client;
		this.clientCount++;
		return true;
	}

	getClient(id) {
		if (!this.clients[id]) {
			throw new Error(`Client ${id} does not exist`);
		}

		return this.clients[id];
	}

	removeClient(id) {
		if (!this.clients[id]) {
			throw new Error(`Client ${id} is not in this room`)
		}

		delete this.clients[id];
		this.clientCount--;
	}

	toJSON() {
		return {
			id: this.id,
			clientCount: this.clientCount,
			clients: this.clients
		};
	}
}