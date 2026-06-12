import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { connect } from './database/mongo.js';
import routes from './routes/index.route.js';
import { gameSocket } from './socket/gameSocket.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use('/api', routes);
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

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
