const rooms = new Map();

function createRoom(roomId, hostSocketId) {
  const room = { id: roomId, host: hostSocketId, players: new Map() };
  rooms.set(roomId, room);
  return room;
}

function addPlayer(roomId, player) {
  const room = rooms.get(roomId);
  if (!room) return null;
  room.players.set(player.socketId, player);
  return room;
}

function removePlayer(roomId, socketId) {
  const room = rooms.get(roomId);
  if (!room) return;
  room.players.delete(socketId);
}

module.exports = { rooms, createRoom, addPlayer, removePlayer };
