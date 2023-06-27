import { useState, useReducer } from "react";
import { socket } from "../../../socket";
import { nowPlayingState, nowPlayingReducer } from "../../../reducers/nowPlayingReducer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from "../../../utils";
import './index.scss';

export const PlayerControls = ({ duration, played, handlePlay, handlePause, nowPlayingServer }) => {
  const [active, setActive] = useState(1);
  const [volumeSlider, setVolumeSlider] = useState(10);
  const [state, dispatch] = useReducer(nowPlayingReducer, nowPlayingState);
  const room = window.location.pathname
    .split('/')
    .pop();

    const playBackRates = [0.25, 0.50, 0.75, 1, 1.25, 1.50, 1.75, 2];

    const handleSeekMouseDown = () => {
      socket.emit('seek', true);
    }

    const handleSeekChange = (e) => {
      let percent = Math.round(e.target.value);
      let seekTo = Math.round(duration/100 * percent);
      socket.emit('seekScrub', { scrubbed: seekTo, room });
    }

    const handleSeekMouseUp = () => {
      socket.emit('seek', false);
    }

    const handlePlaybackRate = (e, rate) => {
      setActive(rate);
      socket.emit('playbackRate', { rate, room });
    }

    const handleFullscreen = () => {
      let el = document.getElementById('react-player');
      el.requestFullscreen() || el.webkitRequestFullScreen() || el.mozRequestFullScreen() || el.msRequestFullScreen();
    }

    const handleVolume = (e) => {
      let num = parseFloat(e.target.value);
      num = num.toFixed(2);
      setVolumeSlider(num);
      dispatch({ type: 'VOLUME_ADJUST', payload: num });
    }

    const handleMute = () => {
      if (volumeSlider !== 0) {
        setVolumeSlider(0)
        dispatch({ type: 'VOLUME_ADJUST', payload: 0 });
      } else {
        setVolumeSlider(100);
        dispatch({ type: 'VOLUME_ADJUST', payload: 100 });
      }
    }

    let volumeUI
    if (volumeSlider === 0) {
      volumeUI = <FontAwesomeIcon icon="fa-solid fa-volume-xmark" className="volume volume-mute" />
    } else if (volumeSlider >= 0.50) {
      volumeUI = <FontAwesomeIcon icon="fa-solid fa-volume-high" className="volume volume-up" />
    } else if (volumeSlider <= 0.49) {
      volumeUI = <FontAwesomeIcon icon="fa-solid fa-volume-low" className="volume volume-down" />
    } else {
      volumeUI = <FontAwesomeIcon icon="fa-solid fa-volume-high" className="volume volume-up" />
    }

    return (
      <div className="player-controls">
        <div className="inner">
          <div className="left-holder">
            {
              nowPlayingServer !== true ?
              <FontAwesomeIcon icon="fa-solid fa-play" onClick={() => handlePlay()} className="play" /> :
              <FontAwesomeIcon icon="fa-solid fa-pause" onClick={() => handlePause()} className="pause" />
            }
          </div>
          <div className="middle-holder">
            <time
              className="time"
              dateTime={`P${Math.round(played)}S`}
            >
              {format(played)}
            </time>

            <input
              type="range"
              className="progress-slider"
              min={0}
              max={100}
              step="any"
              value={Math.round(played/duration * 100) || 0}
              onMouseDown={(e) => handleSeekMouseDown(e)}
              onChange={(e) => handleSeekChange(e)}
              onMouseUp={(e) => handleSeekMouseUp(e)}
            />

            <time
              className="time"
              dateTime={`P${Math.round(played)}S`}
            >
              {format(duration)}
            </time>
          </div>
          <div className="right-holder">
            <div className="playback-rate-holder">
              <ul className="playback-rate">
                {
                  playBackRates.map((rate) => (
                    <li
                      key={rate}
                      onClick={(e) => handlePlaybackRate(e, rate)}
                      className={rate === active ? 'active' : ''}
                    >
                      {rate !== 1 ? rate : 'Normal'}
                    </li>
                  ))
                }
              </ul>
            </div>

            <div className="volume-holder">
              <div
                className="mute"
                onClick={handleMute}
              >
                {volumeUI}
              </div>
              <div className="volume-slider-holder">
                <input
                  type="range"
                  className="volume-slider"
                  min={0}
                  max={1}
                  step="any"
                  value={volumeSlider}
                  onChange={(e) => handleVolume(e)}
                />
              </div>
            </div>

            <FontAwesomeIcon
              icon="fa-solid fa-expand"
              className="fullscreen"
              onClick={(e) => handleFullscreen(e)}
            />
          </div>
        </div>
      </div>
    )
}
