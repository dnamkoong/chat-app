import { Link } from 'react-router-dom'
import { uniqueName } from '../utils';
import '../App.css'

const Home = () => {
  return (
    <div className='Home'>
        <h1>Stream Sync</h1>
        <Link
          to={`/room/${uniqueName}`}
        >
          Join Room
        </Link>
    </div>
  )
}

export default Home
