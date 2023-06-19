import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { socket } from '../socket';
import { uniqueName } from "../utils";
import { MyEvents } from '../components/MyEvents';
import { MyForm } from '../components/MyForm';

const Room = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  let roomName = window.location.pathname
    .split('/')
    .pop();

  useEffect(() => {
    socket.emit('join room', roomName, uniqueName);
  }, [])

  useEffect(() => {
    const onMessage = (user, value) => {
      console.log(user, value);
      setMessages([
        ...messages,
        {
          user, value
        }
      ])
    };

    socket.on('messages', onMessage);

    return () => {
      socket.off('messages', onMessage);
    };
  }), [messages];

  return (
    <>
      <h1>Room1</h1>

      <MyEvents messages={messages} />
      <MyForm
        room={roomName}
        user={uniqueName}
      />

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