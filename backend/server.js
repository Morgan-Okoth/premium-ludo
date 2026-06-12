import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { connect } from './database/mongo.js';
import routes from './routes/index.route.js';
import { gameSocket } from './socket/gameSocket.js';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(process.env.BASE_PATH || '/', routes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL },
});

io.on('connection', (socket) => {
  console.log('client connected');
  gameSocket(socket, io);
});

const port = Number(process.env.PORT || 3001);
server.listen(port, async () => {
  await connect().catch((e) => console.warn('mongo connect failed', e.message));
  console.log(`backend http://localhost:${port}`);
});
