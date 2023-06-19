import { useState, useEffect } from "react";
import { socket } from '../socket';
import { useNavigate } from "react-router-dom"
import { MyEvents } from '../components/MyEvents';
import { MyForm } from '../components/MyForm';

const Room = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const onMessage = (value) => {
      setMessages(msg => [...msg, value]);
    };

    socket.connect();
    socket.on('messages', onMessage);

    return () => {
      socket.off('messages', onMessage);
    };
  }), [];

  return (
    <>
      <h1>Room1</h1>

      <MyEvents messages={messages} />
      <MyForm />

      <button
        type="button"
        onClick={() => navigate(-1)}
      >
        Back to Home
      </button>
    </>
  )
}

export default Room