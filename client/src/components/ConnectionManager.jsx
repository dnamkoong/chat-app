import { socket } from "../socket"

export const ConnectionManager = () => {
  const connect = () => {
    console.log('connect');
    socket.connect();
    socket.emit('chat message', 'wqdwq');
  }

  const disconnect = () => {
    socket.disconnect();
  }

  return (
    <>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </>
  )
}