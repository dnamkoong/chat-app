import { useState, useEffect, useReducer, useRef } from "react";
import { useNavigate } from "react-router-dom"
import { socket } from "../socket";
import { Body } from "../components/Body/Body";
import { Chat } from "../components/Chat/Chat";
import { nameGen, colorGen } from "../utils";
import { chatState, chatReducer } from '../reducers/chatReducer';
import { searchState, searchReducer } from '../reducers/searchReducer';
import { combineReducers } from "../reducers/dataReducer";

const Room = () => {
  const [pageUserId, setPageUserId] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [chatServer, setChatServer] = useState('');;
  const combinedReducers = combineReducers({
    chat: chatReducer,
    search: searchReducer
  });
  const [state, dispatch] = useReducer(combinedReducers, {
    chatState,
    searchState
  });
  const initialized = useRef(false);

  const navigate = useNavigate();

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
  }, [chatServer])

  return (
    <>
      <h1>Room: {room}</h1>
      <Body
        items={state.searchState.items}
      />
      <Chat
        userName={name}
        chatLog={chatLog}
        chatServer={chatServer}
      />

      <button
        type="button"
        onClick={() => navigate(-1)}
      >
        Back to Home
      </button>
    </>
  )
}

export default Room