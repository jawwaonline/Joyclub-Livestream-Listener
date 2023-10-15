import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

dotenv.config();

const PORT = 3000 || process.env.PORT;

const app = express();
app.use(cors());
app.use(morgan('tiny'));
const server = createServer(app);

const io = new Server(server, {
  //   path: '/ws', //LISTENING ON ROUTE /ws ?????
  cors: {
    origin: '*', // Allow all origins or replace "*" with your specific origin
    methods: ['GET', 'POST']
  }
});

app.get('/', (req, res) => {
  res.send(
    '<h1>Welcome to the Joyclub Livestream Listener</h1><p>You find the ws connection on /ws</p>'
  );
});

io.on('connection', (socket) => {
  console.log('a user connected');

  // RECIEVING MESSAGES
  socket.on('message', (msg) => {
    const { username, message, streamerName } = msg;
    console.log(username + ': ' + message);
    // EMITTING MESSAGES

    socket.broadcast.emit('message', {
      username,
      message,
      streamerName
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
