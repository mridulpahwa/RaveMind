import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AudioControls from './ui/Controls/AudioControls'
import VisualizerCanvas from './ui/Controls/VisualizerCanvas'
import VisualizerControls from './ui/Controls/VisualizerControls'

function App() {
  const [count, setCount] = useState(0)

  return (
        <div className="app">
            <div className="controls flex flex-col gap-4">
                <AudioControls />          {/* Upload, play/pause, volume */}
                <VisualizerControls />     {/* Toggle modes, particles, hue speed */}
            </div>
            <VisualizerCanvas />          {/* Where all visuals are drawn */}
        </div>
    );
}

export default App
