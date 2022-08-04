import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import {ClientToServerEvents, ServerToClientEvents} from '../../lib/types';

const app = express();
app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket: Socket<ServerToClientEvents, ClientToServerEvents>) => {
  console.log(`user: ${socket.id} connected`);

  socket.on('disconnect', () => {
    console.log(`user: ${socket.id} disconnected`);
  });

  socket.on('message', (data) => {
    console.log(`user: ${socket.id} sent message: ${data.text}`);
    io.emit('message', data);
  });
});

httpServer.listen(3001, () => {
  console.log('Server listening on port 3001');
});
