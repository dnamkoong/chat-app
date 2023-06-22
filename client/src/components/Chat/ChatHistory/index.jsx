import { useState, useEffect, useRef } from "react";
import { socket } from "../../../socket";
import './index.scss';

export const ChatHistory = ({ user }) => {
  const [chatLog, setChatLog] = useState([]);
  const [chatServer, setChatServer] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (chatServer !== '') {
      let log = chatLog.concat(chatServer);
      setChatLog(log);

      bottomRef?.current?.scrollIntoView({
        behavior: 'smooth'
      });
    }

    const onChatEvent = (data) => {
      setChatServer(data)
    }

    socket.on('chat', onChatEvent);

    return () => {
      socket.off('chat', onChatEvent);
    }
  }, [chatServer])

  return (
    <div
      className="chat-history"
      style={{
        "overflowY": "scroll"
      }}
    >
      {chatLog.map((item, i) => (
        <div
          key={i}
          className={`chat-holder ${user.id === item.id ? 'me' : ''}`}
        >
          <div className="name">
            <span
              className="name-box"
              style={{ background: item.color }}
            ></span>
            <p>{
                item.name.charAt(0).toUpperCase() + item.name.split('-').pop().charAt(0).toUpperCase()
              }</p>
          </div>

          <p className="message">
            {item.chat}
          </p>
        </div>
      ))}
      <div className="bottomRef" ref={bottomRef} style={{ height: "24px" }} />
    </div>
  )
}