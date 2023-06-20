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
  socket.on('join room', ({ room, name, color }) => {
    const user = addUser(socket.id, name, room, color);
    socket.join(room);
    console.log('join room', room, name, color);

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
    // console.log('chat typing: ', data);
    io.to(data.room).emit('chatTyping', data);
  });

  socket.on('userList', (data) => {
    console.log('user list', data);
    io.to(data.room).emit('userList', data)
  })

  socket.on('disconnect', () => {
    console.clear();
    // console.log('A user disconnected: ', socket.id);
    io.emit('messages', `${socket.id} user just disconnected!`);
  });
});

http.listen(4000, () => {
  // console.log(`Server listening on 4000`);
});