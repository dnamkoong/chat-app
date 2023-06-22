const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require('./users');

app.use(cors());

const io = require('socket.io')(http, {
  cors: {
      origin: "http://localhost:8000"
  }
});

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ room, name, color }) => {
    const user = addUser(socket.id, name, room, color);
    socket.join(room);
    console.log('joinRoom', room, name, color);

    // console.log(getUsersInRoom(room).length);

    io.to(room).emit('chat', {
      id: socket.id,
      name,
      room,
      color,
      chat: `${name} has joined ${room}`
    });
    io.to(room).emit('user', user);
  });

  socket.on('chat', (data) => {
    console.log('chat: ', data);

    io.to(data.room).emit('chat', data);
  });

  socket.on('chatTyping', (data) => {
    console.log('chat typing: ', data);
    io.to(data.room).emit('chatTyping', data);
  });

  socket.on('userList', (data) => {
    console.log('user list', data);
    io.to(data.room).emit('userList', data)
  });

  // socket.on('userListLeave', (data) => {
  //   console.log('user list leave', data);
  //   io.to(data.room).emit('userListLeave', data)
  // });

  socket.on('search', (data) => {
    // console.log('search', data);
    io.to(data.room).emit('search', data);
  });

  socket.on('query', (payloadPage, payloadItems, room) => {
    console.log('query: ', payloadPage, payloadItems, room);
    io.to(room).emit('query', (payloadPage, payloadItems, room));
  });

  socket.on('playId', (data) => {
    io.to(data.room).emit('playId', data);
  });

  socket.on('nowPlaying', (data) => {
    io.to(data.room).emit('nowPlaying', data);
  });

  socket.on('nowPlayingProgress', (data) => {
    io.to(data.room).emit('nowPlayingProgress', data);
  });

  socket.on('seek', (data) => {
    io.to(data.room).emit('seek', data);
  });

  socket.on('seekScrub', (data) => {
    io.to(data.room).emit('seekScrub', data);
  });

  socket.on('playbackRate', (data) => {
    io.to(data.room).emit('playbackRate', data);
  });

  socket.on('playing', (data) => {
    io.to(data.room).emit('playing', data);
  });

  socket.on('disconnect', () => {
    console.clear();
    // console.log('A user disconnected: ', socket.id);
    io.emit('messages', `${socket.id} user just disconnected!`);
  });
});

http.listen(4000, () => {
  // console.log(`Server listening on 4000`);
});