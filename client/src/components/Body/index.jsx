import { useState, useEffect, useReducer } from "react";
import millify from 'millify';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ReactTimeAgo from 'react-time-ago';
import { socket } from "../../socket";
import { Search } from './Search';
import { NowPlaying } from './NowPlaying'
import { Player } from './Player';
import { searchReducer, searchState } from "../../reducers/searchReducer";
import searchService from '../../services/searchService';
import './index.scss';

TimeAgo.addLocale(en)

export const Body = ({ user }) => {
  const [searchRoom, setSearchRoom] = useState('');
  const [searchServer, setSearchServer] = useState('');
  const [playingServer, setPlayingServer] = useState(false);
  const [page, setPage] = useState(1);
  const [pageYT, setPageYT] = useState('');
  const [state, dispatch] = useReducer(searchReducer, searchState);
  const room = window.location.pathname
    .split('/')
    .pop();

  useEffect(() => {
    const onSearchEvent = (data) => {
      setSearchServer(data);
      setSearchRoom(data.room);

      if (room === data.room) {
        getSearchQueryYT(data);
      }
    };

    socket.on('search', onSearchEvent);

    return () => {
      socket.off('search', onSearchEvent);
    }
  }, []);

  useEffect(() => {
    if (page >= 0 && pageYT && room === searchRoom) {
      if (pageYT === 'next') {
        getSearchQueryYT(searchServer, state.pageNext);
      } else {
        getSearchQueryYT(searchServer, state.pagePrev);
      }
    }
  }, [page]);

  const getSearchQueryYT = async (data, pageYT) => {
    let payloadPage;

    try {
      payloadPage = await searchService.getSearchQueryYT(data, pageYT);
    } catch (error) {
      return error;
    } finally {
      getSearchPageYT(payloadPage)
    }
  };

  const getSearchPageYT = async (payloadPage) => {
    let payloadItems;

    try {
      payloadItems = await searchService.getSearchPageYT(payloadPage.items);
    } catch(error) {
      return error;
    } finally {
      dispatch({
        type: 'GET_YOUTUBE',
        payloadPage,
        payloadItems,
      });

      socket.emit('query', { searchState, payloadItems, room }); //
    }
  }

  const handlePlaying = (videoId) => {
    const playId = state.items.filter(el => el.id === videoId);

    let data = {
      id: user.id,
      videoId: playId,
      name: user.name,
      room: user.room,
      color: user.color
    };

    if (playingServer === false) {
      data.chat = 'has chosen a video';
      setPlayingServer(!playingServer);
      socket.emit('playId', data);
      socket.emit('chat', data);
      socket.emit('playing', { data, playing: !playingServer });
      socket.emit('nowPlaying', { data, playing: true });
    } else {
      data.chat = 'has changed the video';
      setPlayingServer(!playingServer);
      socket.emit('playId', data);
      socket.emit('chat', data);
      socket.emit('playing', { data, playing: !playingServer });
      socket.emit('nowPlaying', { data, playing: true });
    }
  };

  const handlePageClick = (e) => {
    if (e === 'prev') {
      page > 1 ? setPage(page - 1) : setPage(1);
      setPageYT('prev');
    } else {
      setPage(page + 1);
      setPageYT('next');
    }
  };

  return (
    <div className={`body ${searchServer ? 'active' : ''}`}>
      <div className="inner">
        <Search
          pageYT={pageYT}
          page={page}
        />

        <NowPlaying
          user={user.id}
        />
        <div className="video-container">
          {state && state?.items.map((item, i) => (
            <div
              key={i}
              className="video-holder"
            >
              <div
                className="video-wrapper"
                onClick={() => handlePlaying(item.id)}
              >handlePlaying</div>
              <Player videoId={item.id} />
              <div className="details">
                <h2 className="title">
                  {item.snippet.title}
                </h2>
                <p className="channel">
                  {item.snippet.channelTitle}
                </p>
                <div className="stats">
                  <p className="views white">
                    {millify(item.statistics.viewCount, {
                      precision: 0, lowercase: true
                    })}
                    views
                  </p>
                  <ReactTimeAgo
                    className="update"
                    date={item.snippet.publishedAt
                      ? new Date(item.snippet.publishedAt) : null}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`button-holder ${state?.items.length !== 0 ? 'active' : ''}`}>
          <button
            className="prev"
            onClick={() => handlePageClick('prev')}
          >
            Prev
          </button>
          <button
            className="next"
            onClick={() => handlePageClick('next')}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}