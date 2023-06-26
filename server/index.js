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

    io.to(room).emit('chat', {
      id: socket.id,
      name,
      room,
      color,
      chat: `${name} has joined ${room}`
    });
    io.to(room).emit('user', user);
    io.to(room).emit('userList', getUsersInRoom(room));
  });

  socket.on('chat', (data) => {
    io.to(data.room).emit('chat', data);
  });

  socket.on('chatTyping', (data) => {
    io.to(data.room).emit('chatTyping', data);
  });

  socket.on('search', (data) => {
    // console.log('search', data);
    io.to(data.room).emit('search', data);
  });

  socket.on('query', (payloadPage, payloadItems, room) => {
    // console.log('query: ', payloadPage, payloadItems, room);
    io.to(room).emit('query', (payloadPage, payloadItems, room));
  });

  socket.on('playId', (data) => {
    io.to(data.room).emit('playId', data);
  });

  socket.on('nowPlaying', (data) => {
    // console.log('nowPlaying: ', data);
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

  socket.on('disconnecting', () => {
    let toLeave = removeUser(socket.id)

		if (toLeave) {
			io.to(toLeave.room).emit('chat', {
				room: toLeave.room,
				id: toLeave.id,
				name: toLeave.name,
				chat: `${toLeave.name} has left the room`,
				color: toLeave.color
			});

      io.to(toLeave.room).emit('userList', getUsersInRoom(toLeave.room));
		};
  });
});

http.listen(4000, () => {
  // console.log(`Server listening on 4000`);
});