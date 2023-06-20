import { useState, useEffect } from "react";
import ReactPlayer from 'react-player/lazy';
import { socket } from "../../socket";

export const Player = ({ videoId, nowPlaying }) => {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const onPlayIdEvent = () => {
      setPlaying(!playing);
    }

    socket.on('playId', onPlayIdEvent);

    return () => {
      socket.off('playId', onPlayIdEvent);
    }
  }, []);

  return (
    <div className="player">
      <ReactPlayer
        url={`youtube.com/watch?v=${videoId}`}
        playing={nowPlaying}
        width='100%'
        height='100%'
        controls
      />
    </div>
  )
}