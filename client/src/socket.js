import { io } from 'socket.io-client';

// // "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? 'https://stream-chat-server-768f6e9e8717.herokuapp.com/' : 'http://localhost:4000';

// export const socket = io.connect(URL);

export const socket = io(URL, {
  transports: ['websocket'], upgrade: false
})