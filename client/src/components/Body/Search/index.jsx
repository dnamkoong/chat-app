import { useState } from "react";
import { socket } from "../../../socket";
import Input from "../../Input";
import './index.scss';

export const Search = ({ room }) => {
  const [search, setSearch] = useState('nba');

  const handleQuery = (e) => {
    e.preventDefault();

    socket.emit('search', { room, search });
  };

  return (
    <div className="search">
      <Input
        value={search}
        onChange={setSearch}
        placeHolder="Search Youtube"
        btnClick={handleQuery}
        btnText="Search"
      />
    </div>
  )
}