import { useState } from "react";
import { socket } from "../../../socket";
import Input from "../../Input";
import './index.scss';

export const Search = () => {
  const [search, setSearch] = useState('nba');
  const room = window.location.pathname
    .split('/')
    .pop();

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
        active={search !== '' ? true : false}
        btnClick={handleQuery}
        btnText="Search"
      />
    </div>
  )
}