import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function App() {
  useEffect(() => {
    document.querySelector('#three')!.innerHTML = ''
  })

  return (
    <>
      <h1>Small three game</h1>
      <Link
        to="/game"
        style={{
          color: 'white',
          padding: '8px',
          background: 'blue',
          fontSize: '20px',
          textDecoration: 'none',
        }}
      >
        Go to the game
      </Link>
    </>
  )
}
