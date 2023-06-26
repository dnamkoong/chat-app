import { useState, useEffect, useRef } from "react";
import ReactPlayer from 'react-player';
import { socket } from "../../../socket";
import { PlayerControls } from '../PlayerControls';
// import { nowPlayingState, nowPlayingReducer } from '../../../reducers/nowPlayingReducer';
// import { combineReducers } from "../../../reducers/dataReducer";
import './index.scss';

export const NowPlaying = ({ user }) => {
  const [nowPlayingId, setNowPlayingId] = useState('');
  const [nowPlayingServer, setNowPlayingServer] = useState(false);
  const [played, setPlayed] = useState(0.00);
  const [duration, setDuration] = useState(0.00);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  // const combinedReducers = combineReducers({
  //   chat: chatReducer,
  //   nowPlaying: nowPlayingReducer
  // });
  // const [state, dispatch] = useReducer(combinedReducers, {
  //   chatState,
  //   nowPlayingState
  // });
  const refContainer = useRef(null);

  useEffect(() => {
    const onPlayIdEvent = (data) => {
      if (data.room === user.room) {
        setNowPlayingId(data.videoId[0].id);
      }
    };
    const onNowPlayingEvent = (data) => {
      setNowPlayingServer(data.playing);
    };
    const onNowPlayingProgressEvent = (data) => {
      let progress = Math.round(parseFloat(data.progress));
      setPlayed(progress);
    };
    const onSeekScrubEvent = (data) => {
      setPlayed(data.scrubbed);
      refContainer.current.seekTo(data.scrubbed);
      // setNowPlayingServer(true);
    };
    const onPlaybackRateEvent = (data) => {
      setPlaybackRate(data.rate);
    };

    socket.on('playId', onPlayIdEvent);
    socket.on('nowPlaying', onNowPlayingEvent);
    socket.on('nowPlayingProgress', onNowPlayingProgressEvent);
    socket.on('seekScrub', onSeekScrubEvent);
    socket.on('playbackRate', onPlaybackRateEvent);

    return () => {
      socket.off('playId', onPlayIdEvent);
      socket.off('nowPlaying', onNowPlayingEvent);
      socket.off('nowPlayingProgress', onNowPlayingProgressEvent);
      socket.off('seekScrub', onSeekScrubEvent);
      socket.off('playbackRate', onPlaybackRateEvent);
    }
  }, []);

  const handlePlay = () => {
    socket.emit('nowPlaying', { playing: true, room: user.room });
    let data = {
      id: user.id,
      videoId: nowPlayingId,
      name: user.name,
      room: user.room,
      chat: `${user.name} has resumed the video`,
      color: user.color
    };
    if (nowPlayingServer === false) {
      socket.emit('chat', data);
    }
  };

  const handlePause = () => {
    socket.emit('nowPlaying', { playing: false, room: user.room });
    let data = {
      id: user.id,
      videoId: nowPlayingId,
      name: user.name,
      room: user.room,
      chat: `${user.name} has paused the video`,
      color: user.color
    };
    if (nowPlayingServer !== false) {
      socket.emit('chat', data);
    }
  };

  const handleProgress = (e) => {
    socket.emit('nowPlayingProgress', {
      progress: e.playedSeconds,
      room: user.room
    });
    setPlayed(e.playedSeconds)
  };

  return (
    <div className={`now-playing ${nowPlayingId !== '' ? 'active' : 'hide'}`}>
      <div className="video-holder">
        <ReactPlayer
          id="react-player"
          ref={refContainer}
          width="100%"
          height="100%"
          url={`youtube.com/watch?v=${nowPlayingId}`}
          onProgress={(e) => handleProgress(e)}
          playing={nowPlayingServer}
          playbackRate={playbackRate}
          // volume={state.nowPlayingState.volume}
          muted={false}

          onDuration={(e) => setDuration(e)}
          onPlay={(e) => handlePlay(e)}
          onPause={(e) => handlePause(e)}
        />
        <PlayerControls
          duration={duration}
          played={played}
          handlePlay={handlePlay}
          handlePause={handlePause}
          nowPlayingServer={nowPlayingServer}
          // volume={state.nowPlayingState.volume}
        />
      </div>
    </div>
  )
}