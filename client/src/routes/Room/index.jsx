import { useState, useEffect } from "react";
import { socket } from "../../socket";
import { Body } from "../../components/Body";
import { Chat } from "../../components/Chat";
import { nameGen, colorGen } from "../../utils";
import './index.scss';

const Room = () => {
  const [user, setUser] = useState('');
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

    const onUserEvent = (data) => {
      // console.log('user:', data, userName);
      if (name === data.name) {
        const { id, name, room, color } = data;
        setUser({ id, name, room, color });
        // setPageUserId(data.id)
        socket.emit('userList', { id, name, room, color });
      }
    };

    socket.on('user', onUserEvent);

    return () => {
      socket.off('user', onUserEvent);
    }
  }, []);

  return (
    <div className="room">
      <div className="inner">
        <Body
          user={user}
        />
        <Chat
          user={user}
          userName={name}
        />
      </div>
    </div>
  )
}

export default Room