import { useState } from "react";
import ReactPlayer from 'react-player'
import { socket } from "../../socket"

export const Body = ({ room, user }) => {
  const [value, setValue] = useState('');

  return (
    <div className="body">
      <input
        type="text"
      />

      <ReactPlayer
        url="http://www.youtube.com/watch?v=ysz5S6PUM-U"
      />
    </div>
  )
}