/* eslint-disable react-refresh/only-export-components */
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const App = React.lazy(() => import('./App'))
const Game = React.lazy(() => import('./game/Game'))

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
    },
    {
      path: '/game',
      element: <Game />,
    },
  ],
  {
    basename: '/small-three-game',
  }
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>
)
