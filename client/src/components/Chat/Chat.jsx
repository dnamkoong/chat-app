import { useState, useEffect, useRef, useReducer } from "react";
import { socket } from "../../socket"
import Input from "../Input";
import { chatState as initialState, chatReducer } from "../../reducers/chatReducer";

export const Chat = ({ chatLog, userName }) => {
  const [chat, setChat] = useState('');
  const [typing, setTyping] = useState({ id: undefined, active: false });
  const [user, setUser] = useState('');
  const [name, setName] = useState('');
  const [namePrev, setNamePrev] = useState('');
  const [chatSettings, setChatSettings] = useState(false);
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const bottomRef = useRef(null);

  const room = window.location.pathname
    .split('/')
    .pop();

  useEffect(() => {
    const onUserEvent = (data) => {
      if (userName === data.name) {
        const { id, name, room, color } = data;
        setUser({ id, name, room, color });
        setNamePrev(data.name);
        socket.emit('userList', { id, name, room, color });
      }
    };

    const onUserListEvent = (data) => {
      // console.log('onUserListEvent: ', data);
      const { id, name, room, color } = data;
      // socket.emit('userList', { id, name, room, color })
      dispatch({ type: 'POST_USER_LIST', payload: { id, name, room, color } });
    }

    socket.on('user', onUserEvent);

    socket.on('userList', onUserListEvent);

    return () => {
      socket.off('user', onUserEvent);
      socket.off('userList', onUserListEvent);
    }
  }, []);

  useEffect(() => {
    let data = {
      id: user.id,
      name: user.name,
      room,
      active: false
    };

    if (chat !== '') {
      data.active = true;
    }

    socket.emit('chatTyping', data);

    socket.on('chatTyping', data => {
      setTyping({
        id: data.id,
        name: data.name,
        room: data.room,
        active: data.active
      });
    });

    bottomRef?.current?.scrollIntoView({
      behavior: 'smooth'
    })
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
    console.log(name);

    setUser({ id, name, color });
    let msg = { id, name, room, chat: `${namePrev} changed to ${name}`, color };
    socket.emit('chat', msg);
    setUser({ id, name, room, color });
    setName('');
    setChatSettings(false);
  };

  let chatHistory = '';
  chatHistory = (
    <div
      className="chat-history"
      style={{
        "overflowY": "scroll"
      }}
    >
      {chatLog.map((item, i) => item.chat !== '' ? (
          <div
            key={i}
            className={user.id === item.id ? 'me' : ''}
          >

            <div className="name">
              <span
                className="nameBox"
                style={{ background: item.color }}
              >
                {
                  item.name.charAt(0).toUpperCase() + item.name.split('-').pop().charAt(0).toUpperCase()
                } :
              </span>

              <span className="chat">
                {item.chat}
              </span>
            </div>

          </div>
      ) : '')}
      <div ref={bottomRef} style={{ height: "24px" }} />
    </div>
  )

  let chatTyping = '';
  chatTyping = (
    <p className={typing.active ? 'active' : ''} style={{ margin: "0" }}>
      {typing.active ? `${typing.name} is typing` : ''}
    </p>
  )

  return (
    <div className="chat">
      <div className="inner">
        <Input
          className={`nameChange ${chatSettings ? 'active' : ''}`}
          value={name}
          onChange={setName}
          placeHolder="Change name"
          active={name !== '' ? true : false}
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
        {chatHistory}
        {chatTyping}
        <Input
          className="message"
          value={chat}
          onChange={setChat}
          placeHolder="Send message"
          active={chat !== '' ? true : false}
          btnClick={handleChat}
          btnText="Send"
        />
      </div>
    </div>
  )
}