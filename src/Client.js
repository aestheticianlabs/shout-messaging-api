export default class Client {
	constructor(socket, id, room) {
		this.socket = socket;
		this.id = id;
		this.room = room;
	}

	toJSON() {
		return {
			id: this.id,
			room: this.room.id
		}
	}
}