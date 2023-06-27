import { useState, useEffect, useReducer } from "react";
import { socket } from "../../socket";
import { Body } from "../../components/Body";
import { Chat } from "../../components/Chat";
import { nameGen, colorGen } from "../../utils";
import { chatState, chatReducer } from "../../reducers/chatReducer";
import { SearchProvider } from "../../context/SearchContext";
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
      if (data.length > 0) {
        let newNameUser = data.find(user => user.color === color);
        setUser(newNameUser);
      }
      if (color === data.color) {
        const { id, name, room, color } = data;
        setUser({ id, name, room, color });
        // setPageUserId(data.id)
      }
    };

    const onUserListEvent = (payload) => {
      dispatch({ type: 'POST_USER_LIST', payload });
    }

    socket.on('user', onUserEvent);
    socket.on('userList', onUserListEvent);

    return () => {
      socket.off('user', onUserEvent);
      socket.off('userList', onUserListEvent);
    }
  }, []);

  return (
    <>
      <SearchProvider>
        <div className="room">
          <div className="inner">
            <Body
              user={user}
            />
            <Chat
              user={user}
              userList={state.userList}
            />
          </div>
        </div>
      </SearchProvider>
    </>
  )
}

export default Room