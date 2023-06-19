const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

const io = require('socket.io')(http, {
  cors: {
      origin: "http://localhost:8000"
  }
});

io.on('connection', async (socket) => {
  socket.on('join room', (room, name) => {
    console.log('room name: ', room, name);
    socket.join(room);

    io.to(room).emit('join room', `${name} has joined ${room} room`)
  });

  socket.on('messages', (room, user, message) => {
    console.log('messages: ', room, user, message);

    io.to(room).emit('messages', user, message);
  });

  // socket.on('chat typing', ({ room, user }) => {
  //   console.log('chat typing: ', room, user);
  //   io.to(room).emit('messages', user, 'chat typing');
  // })

  socket.on('disconnect', () => {
    console.clear();
    // console.log('A user disconnected: ', socket.id);
    io.emit('messages', `${socket.id} user just disconnected!`);
  });
});

http.listen(4000, () => {
  // console.log(`Server listening on 4000`);
});