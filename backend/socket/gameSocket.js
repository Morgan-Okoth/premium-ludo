import { Server } from 'socket.io';

export function gameSocket(socket, io) {
  socket.on('join', (room) => socket.join(room));
  socket.on('leave', (room) => socket.leave(room));
  socket.on('roll', (payload) => socket.to(payload.room).emit('roll', payload));
  socket.on('move', (payload) => socket.to(payload.room).emit('move', payload));
  socket.on('chat', (payload) => socket.to(payload.room).emit('chat', payload));
}
