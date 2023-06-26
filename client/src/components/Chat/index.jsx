import { useState, useEffect, useReducer } from "react";
import { socket } from "../../socket"
import Input from "../Input";
import { ChatHistory } from "./ChatHistory";
import { chatState, chatReducer } from "../../reducers/chatReducer";
import './index.scss';

export const Chat = ({ user, userName }) => {
  // const [pageUserId, setPageUserId] = useState('');
  const [chat, setChat] = useState('');
  const [typing, setTyping] = useState({ id: undefined, active: false });
  const [name, setName] = useState('');
  const [chatSettings, setChatSettings] = useState(false);
  const [state, dispatch] = useReducer(chatReducer, chatState);

  const room = window.location.pathname
    .split('/')
    .pop();


  useEffect(() => {
    const onUserListEvent = (data) => {
      // console.log('userList:', data);
      const { id, name, room, color } = data;
      // socket.emit('userList', { id, name, room, color })
      dispatch({ type: 'POST_USER_LIST', payload: { id, name, room, color } });
    }

    socket.on('userList', onUserListEvent);

    return () => {
      socket.off('userList', onUserListEvent);
    }
  }, []);

  useEffect(() => {
    let data = {
      id: user.id,
      name: user.name,
      room,
      active: !!chat
    };

    socket.emit('chatTyping', data);

    const onChatTypingEvent = (data) => {
      setTyping({
        id: data.id,
        name: data.name,
        room: data.room,
        active: data.active
      });
    };

    socket.on('chatTyping', onChatTypingEvent);

    return () => {
      socket.off('chatTyping', onChatTypingEvent);
    }
  }, [chat]);

  const handleChat = (e) => {
    e.preventDefault();
    const { id, name, room, color } = user;

    socket.emit('chat', { id, name, room, color, chat });
    setChat('');
  };

  const handleName = (e) => {
    e.preventDefault();
    const { id, room, color } = user;

    let msg = { id, name, room, chat: `${userName} changed to ${name}`, color };
    socket.emit('chat', msg);
    socket.emit('user', { id, name, room, color });

    setName('');
    setChatSettings(false);
  };

  return (
    <div className="chat">
      <div className="inner">
        <Input
          className={`name-change ${chatSettings ? 'active' : ''}`}
          value={name}
          onChange={setName}
          placeHolder="Change name"
          btnClick={handleName}
          btnText="Save"
        />
        <button
          className="btn btn-settings"
          onClick={() => setChatSettings(!chatSettings)}
        >
          Settings
        </button>
        <hr />
        <ChatHistory user={user} />
        {
          typing.active && (
            <p className="typing">
              {typing.name} is typing
            </p>
          )
        }
        <Input
          className="message"
          value={chat}
          onChange={setChat}
          placeHolder="Send message"
          btnClick={handleChat}
          btnText="Send"
        />
      </div>
    </div>
  )
}