import { useEffect } from "react";
import { socket } from "../../socket";
import { Body } from "../../components/Body";
import { Chat } from "../../components/Chat";
import { nameGen, colorGen } from "../../utils";
import './index.scss';

const Room = () => {
  let initialized = false;

  const name = nameGen();
  const color = colorGen();

  let room = window.location.pathname
    .split('/')
    .pop();

  useEffect(() => {
    if (!initialized) {
      socket.emit('joinRoom', { name, room, color });
      initialized = true;
    }
  }, []);

  return (
    <div className="room">
      <div className="inner">
        <Body />
        <Chat
          userName={name}
        />
      </div>
    </div>
  )
}

export default Room