import { useState, useEffect, useReducer } from "react";
import { socket } from "../../socket";
import { Body } from "../../components/Body";
import { Chat } from "../../components/Chat";
import { nameGen, colorGen } from "../../utils";
import { chatState, chatReducer } from "../../reducers/chatReducer";
import './index.scss';

const Room = () => {
  const [user, setUser] = useState('');
  const [state, dispatch] = useReducer(chatReducer, chatState);
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

    const onUserDisconnectEvent = ({ id, name, room, color }) => {
      console.log('onUserDisconnectEvent: ', id, name, room, color);
      socket.emit('chat', {
        id,
        name,
        room,
        color,
        chat: `${name} has left the roomX`
      });
    };

    const onUserListEvent = (data) => {
      // console.log('userList:', data);
      const { id, name, room, color } = data;
      // socket.emit('userList', { id, name, room, color })
      dispatch({ type: 'POST_USER_LIST', payload: { id, name, room, color } });
    }

    socket.on('user', onUserEvent);
    socket.on('disconnected', onUserDisconnectEvent);
    socket.on('userList', onUserListEvent);

    return () => {
      socket.off('user', onUserEvent);
      socket.off('disconnected', onUserDisconnectEvent);
      socket.off('userList', onUserListEvent);
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