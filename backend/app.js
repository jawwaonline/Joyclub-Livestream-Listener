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

let currentRooms = {};

const io = new Server(server, {
  //   path: '/ws', //LISTENING ON ROUTE /ws DOESNT WORK?????
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

// UPDATING AND EMITTING THE CURRENT AVAILABLE ROOMS
io.on('connection', (socket) => {
  io.emit('currentRooms', currentRooms);
  console.log('a user connected');

  // WHEN USER JOINS A ROOM, CHECK IF ROOM ALREADY EXIST
  // IF NOT CREATE ONE AND ADD ROOM TO STORE
  socket.on('join room', (room, streamerName) => {
    // CHECK IF ROOM ALREADY EXISTS AND USERCOUNT IS LESS THAN ONE IN A ROOM
    //console.log(io.sockets.adapter.rooms.get(room)?.size >= 1);
    if (
      currentRooms[room] &&
      io.sockets.adapter.rooms.get(room)?.size >= 1
    )
      return;
    // STORING THE ROOM, THE USER, THE SOCKET ID, STREAMERNAME
    currentRooms[room] = {
      userInRoom: true,
      socketID: socket.id,
      streamerName: streamerName
    }; // Add the room to the rooms object
    socket.join(room);
    console.log(
      `User joined room: ${room} of the streamer: ${streamerName}`
    );

    // SENDING ALL ROOMS TO CLIENTS

    io.emit('currentRooms', currentRooms);
  });

  // BUGGY
  // WHEN ROOM DELETED REMOVE ROOM FROM STORE
  socket.on('leave room', (room) => {
    socket.leave(room);
    delete currentRooms[room];
    console.log(`User left room: ${room}`);
    // SENDING ALL ROOMS TO CLIENTS
    io.emit('currentRooms', currentRooms);
  });

  // RECIEVING MESSAGES FROM ROOM AND EMITING THEM
  socket.on('messagesToRoom', (room, messages) => {
    const { chatMessage, chatUsername, streamerName, channelID } =
      messages;
    const emitterUser = socket.id;
    // CONTROL LOGGING IF LIMIT TO ROOMS WORKS - SHOWING ALL ROOM CONNECTIONS
    for (const room in currentRooms) {
      const usersInRoom = io.sockets.adapter.rooms.get(room)?.size;
      console.log('room: ' + room + 'users: ' + usersInRoom);
    }
    // TO AVOID MULTIPLE MESSAGES FROM THE SAME CHANNEL
    if (currentRooms[room]?.socketID === emitterUser) {
      console.log('.....emitting message...to client');
      io.emit('allMessages', {
        chatMessage,
        chatUsername,
        streamerName,
        channelID
      });
    }
    return;
  });
  // REMOVING ROOM IF NO EXTENSION IS LISTENING
  socket.on('disconnect', () => {
    for (const room in currentRooms) {
      if (currentRooms[room].socketID === socket.id) {
        delete currentRooms[room];
      }
    }
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
