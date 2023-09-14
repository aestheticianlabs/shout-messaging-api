import Room from './Room.js';

const rooms = [];

function getNoRoomError(id) { return new Error(`No room with id ${id}`); }

function exists(id) { return typeof rooms[id] !== 'undefined'; }

function create(id) {
	if (exists(id)) {
		throw new Error(`Room with id ${id} already exists.`);
	}

	const room = new Room(id);
	rooms[id] = room;
	return room;
}

function get(id) {
	if (!exists(id)) throw getNoRoomError();

	return rooms[id];
}

function getOrCreate(id) {
	return exists(id) ? get(id) : create(id);
}

function destroy(id) {
	if (!exists(id)) throw getNoRoomError();

	delete rooms[id];
}

export default {
	exists,
	create,
	get,
	getOrCreate,
	destroy
}