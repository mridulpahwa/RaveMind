import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AudioControls from './ui/Controls/AudioControls'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>RaveMind</h1>
      <AudioControls />
    </div>
  )
}

export default App
