import { useState, useEffect } from "react";
import { socket } from "../../socket"
import Input from "../Input";
import { ChatHistory } from "./ChatHistory";
import './index.scss';

export const Chat = ({ user }) => {
  const [chat, setChat] = useState('');
  const [typing, setTyping] = useState({ id: undefined, active: false });
  const [newName, setNewName] = useState('');
  const [chatSettings, setChatSettings] = useState(false);

  const { id, name, room, color } = user;

  useEffect(() => {
    let data = {
      id,
      name,
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
    socket.emit('chat', { id, name, room, color, chat });
    setChat('');
  };

  const handleName = (e) => {
    e.preventDefault();
    let msg = { id, name, room, chat: `${name} changed to ${newName}`, color };
    socket.emit('chat', msg);
    socket.emit('user', { id, room, name: newName, color });

    setNewName('');
    setChatSettings(false);
  };

  return (
    <div className="chat">
      <div className="inner">
        <Input
          className={`name-change ${chatSettings ? 'active' : ''}`}
          value={newName}
          onChange={setNewName}
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