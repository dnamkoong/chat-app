import { useState, useEffect, useReducer } from "react";
import { createPortal } from 'react-dom';
import { socket } from "../../socket"
import Input from "../Input";
import { ChatHistory } from "./ChatHistory";
import { searchReducer, searchState } from "../../reducers/searchReducer";
import './index.scss';

export const Chat = ({ user, userList }) => {
  const [chat, setChat] = useState('');
  const [typing, setTyping] = useState({ id: undefined, active: false });
  const [newName, setNewName] = useState('');
  const [chatSettings, setChatSettings] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showPlayed, setShowPlayed] = useState(false);
  const [state, dispatch] = useReducer(searchReducer, searchState);

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
        <div className={`chat-settings ${chatSettings ? 'active' : ''}`}>
          <Input
            className="name-change"
            value={newName}
            onChange={setNewName}
            placeHolder="Change name"
            btnClick={handleName}
            btnText="Save"
          />
          {
            showAllUsers && createPortal(
              <div className="users-list">
                <div className="inner">
                  <h2>Users list</h2>
                  <ul>
                    {userList.map(user => <li key={user.id}>{user.name}</li>)}
                  </ul>

                  <button
                    className="btn"
                    onClick={() => setShowAllUsers(!showAllUsers)}
                  >
                    Close
                  </button>
                </div>
              </div>,
              document.querySelector("#root > div > div > div.chat")
            )
          }
          {
            showPlayed && createPortal(
              <div className="users-list">
                <div className="inner">
                  <h2>Videos played</h2>
                  <ul>
                    {state.videoHistory.map(({ publishedAt, title }) => (
                      <li
                        key={publishedAt}
                      >
                        {title}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="btn"
                    onClick={() => setShowPlayed(!showPlayed)}
                  >
                    Close
                  </button>
                </div>
              </div>,
              document.querySelector("#root > div > div > div.chat")
            )
          }
          <button
            className="btn"
            onClick={() => setShowAllUsers(!showAllUsers)}
          >
            {showAllUsers ? 'Hide' : 'Show'} all users
          </button>
          <button
            className="btn"
            onClick={() => setShowPlayed(!showPlayed)}
          >
            {showPlayed ? 'Hide' : 'Show'} played videos
          </button>
          <button
            className="btn"
            onClick={() => setChatSettings(!chatSettings)}
          >
            {chatSettings ? 'Close' : ''} Settings
          </button>
          <hr />
        </div>
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