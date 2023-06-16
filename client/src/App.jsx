import { useState, useEffect } from 'react'
import { socket } from './socket';
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import { MyEvents } from './components/MyEvents';
import { MyForm } from './components/MyForm';
import './App.css'

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onMessage = (value) => {
      setMessages(msg => [...msg, value]);
    };

    socket.connect();
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('messages', onMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('messages', onMessage);
    };
  }), [];

  return (
    <div className='App'>
      <ConnectionState isConnected={isConnected} />
      <MyEvents messages={messages} />
      <ConnectionManager />
      <MyForm />
    </div>
  )
}

export default App
