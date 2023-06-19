import { useState } from "react";
import { socket } from "../socket"

export const MyForm = ({ room, user }) => {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (value) => {
    socket.emit('chat typing', { room, user });

    setValue(value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    socket.timeout(500).emit('messages', room, user, value, () => {
      setIsLoading(false);
      setValue('');
    })
  }

  return (
    <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => handleChange(e.target.value)}
          value={value}
        />

        <button
          type="submit"
          disabled={isLoading}
        >
          Submit
        </button>
    </form>
  )
}