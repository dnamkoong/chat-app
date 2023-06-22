import { Link } from 'react-router-dom'
import { nameGen } from '../../utils';
import './index.scss'

const Home = () => {
  return (
    <div className='home'>
      <div className="inner">
        <h1>Stream Party</h1>
        <p>Watch videos with friends and family from far away!</p>
        <Link
          to={`/room/${nameGen()}`}
          className='btn'
        >
          Join Room
        </Link>
      </div>
    </div>
  )
}

export default Home
