import { useState } from "react";
import { socket } from "../socket"

export const MyForm = () => {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    socket.timeout(500).emit('messages', value, () => {
      setIsLoading(false);
    })
  }

  return (
    <form onSubmit={onSubmit}>
        <input
          type="text"
          onChange={(e) => setValue(e.target.value)}
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