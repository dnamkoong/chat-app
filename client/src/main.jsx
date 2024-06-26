import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import Root from './routes/root';
import ErrorPage from './error-page';
import Home from './routes/Home';
import Room from './routes/Room';
import './index.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faVolumeXmark,
  faVolumeHigh,
  faVolumeLow,
  faPlay,
  faPause,
  faExpand,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faVolumeXmark,
  faVolumeHigh,
  faVolumeLow,
  faPlay,
  faPause,
  faExpand,
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/room/:roomName',
        element: <Room />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
