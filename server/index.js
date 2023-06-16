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

io.on('connection', (socket) => {
  console.log(`${socket.id} user just connected!`);

  socket.on('messages', (msg) => {
    console.log('message: ', msg);
    io.emit('messages', msg)
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected: ', socket.id);
  });
});

http.listen(4000, () => {
  console.log(`Server listening on 4000`);
});
