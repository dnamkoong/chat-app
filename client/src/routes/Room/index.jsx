import { useState, useEffect, useReducer, useRef } from "react";
import { socket } from "../../socket";
import { Body } from "../../components/Body";
import { Chat } from "../../components/Chat";
import { nameGen, colorGen } from "../../utils";
import { chatState } from '../../reducers/chatReducer';
import { combineReducers } from "../../reducers/dataReducer";
import './index.scss';

const Room = () => {
  const [pageUserId, setPageUserId] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [chatServer, setChatServer] = useState('');;
  const [state, dispatch] = useReducer(combineReducers, {
    chatState,
  });
  const initialized = useRef(false);

  const name = nameGen();
  const color = colorGen();

  let room = window.location.pathname
    .split('/')
    .pop();


  useEffect(() => {
    if (!initialized.current) {
      socket.emit('joinRoom', { name, room, color });
      initialized.current = true;
    }

    const onUserEvent = (data) => {
      if (name === data.name) {
        setPageUserId(data.id)
      }
    };

    const onChatEvent = (data) => {
      setChatServer(data)
    }

    socket.on('user', onUserEvent);
    socket.on('chat', onChatEvent);

    return () => {
      socket.off('user', onUserEvent);
      socket.off('chat', onChatEvent);
    }

  }, [])

  useEffect(() => {
    const onUserListLeaveEvent = (data) => {
      if (data.room === room) {
        dispatch({ type: 'POST_USER_LIST_LEAVE', payload: data });

        if (pageUserId && pageUserId !== data.id) {
          setChatServer(data)
        }
      }
    }

    socket.on('userListLeave', onUserListLeaveEvent);

    return () => {
      socket.off('userListLeave', onUserListLeaveEvent);
    }
  }, [pageUserId])

  useEffect(() => {
    if (chatServer !== '') {
      let log = chatLog.concat(chatServer);
      setChatLog(log);
    }

    console.log();
  }, [chatServer])

  return (
    <div className="room">
      <div className="inner">
        <Body />
        <Chat
          userName={name}
          chatLog={chatLog}
          chatServer={chatServer}
        />
      </div>
    </div>
  )
}

export default Room