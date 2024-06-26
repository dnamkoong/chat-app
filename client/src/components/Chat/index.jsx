import { useState, useEffect, useContext } from "react";
import { createPortal } from 'react-dom';
import { socket } from "../../socket"
import Input from "../Input";
import { ChatHistory } from "./ChatHistory";
import { SearchContext } from "../../context/SearchContext";
import './index.scss';

export const Chat = ({ user, userList }) => {
  const [chat, setChat] = useState('');
  const [typing, setTyping] = useState({ id: undefined, active: false });
  const [newName, setNewName] = useState('');
  const [chatSettings, setChatSettings] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showPlayed, setShowPlayed] = useState(false);
  const [showSearched, setShowSearched] = useState(false);
  const searchState = useContext(SearchContext);

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
              <div className="portal-list">
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
            showSearched && createPortal(
              <div className="portal-list">
                <div className="inner">
                  <h2>Videos Searched</h2>
                  <ul>
                    {searchState.searchHistory.map((search, i) => (
                      <li
                        key={i}
                      >
                        {search}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="btn"
                    onClick={() => setShowSearched(!showSearched)}
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
              <div className="portal-list">
                <div className="inner">
                  <h2>Videos played</h2>
                  <ul>
                    {searchState.videoHistory.map(({ publishedAt, title }) => (
                      <li
                        key={publishedAt + 1}
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
            onClick={() => setShowSearched(!showSearched)}
          >
            {showPlayed ? 'Hide' : 'Show'} searched videos
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