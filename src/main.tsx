import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { App } from './App'
import { Game } from './game/Game'

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
    <RouterProvider router={router} />
  </React.StrictMode>
)
