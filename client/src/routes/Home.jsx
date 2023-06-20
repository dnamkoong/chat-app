import { Link } from 'react-router-dom'
import { nameGen } from '../utils';
import '../App.css'

const Home = () => {
  return (
    <div className='Home'>
        <h1>Stream Sync</h1>
        <Link
          to={`/room/${nameGen()}`}
        >
          Join Room
        </Link>
    </div>
  )
}

export default Home
