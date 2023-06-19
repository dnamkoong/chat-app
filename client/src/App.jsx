// import { Route, Switch } from 'react-router-dom';
// import Home from './pages/Home';
// import Room from './pages/Room';

// function App() {
//   <Switch>
//     <Route path="/" exact element={<Home />} />
//     <Route path="/room/" element={<Room />}/>
//   </Switch>
// }

// export default App;



import { useState, useEffect } from 'react'
import { socket } from './socket';
import { MyEvents } from './components/MyEvents';
import { MyForm } from './components/MyForm';
import './App.css'

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const onMessage = (value) => {
      setMessages(msg => [...msg, value]);
    };

    socket.connect();
    socket.on('messages', onMessage);

    return () => {
      socket.off('messages', onMessage);
    };
  }), [];

  return (
    <div className='App'>
      <MyEvents messages={messages} />
      <MyForm />
    </div>
  )
}

export default App
