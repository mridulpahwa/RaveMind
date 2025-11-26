// src/App.jsx
import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// UI Components
import AudioControls from './ui/Controls/AudioControls'
import VisualizerCanvas from './ui/Controls/VisualizerCanvas'
import VisualizerControls from './ui/Controls/VisualizerControls'

// AI Engines
import { patternGenerator } from './ai/generation/PatternGenerator';
import { midiPlayer } from './ai/midi/MidiPlayer';

function App() {
  // State to track if the AI is currently playing
  const [isRaving, setIsRaving] = useState(false);

  // 1. Load the AI Model immediately when the app starts
  useEffect(() => {
    patternGenerator.loadModel();
  }, []);

  // 2. Button Logic: Toggle Start/Stop
  const handleToggleRave = async () => {
    if (!isRaving) {
      // START
      // Initialize Tone.js (requires user click interaction first)
      await midiPlayer.initialize(); 
      
      // Start the generator loop using the player
      patternGenerator.start(midiPlayer);
      setIsRaving(true);
    } else {
      // STOP
      patternGenerator.stop();
      setIsRaving(false);
    }
  };

  return (
        <div className="app">
            <div className="controls flex flex-col gap-4">
                <AudioControls />          {/* Upload, play/pause, volume */}
                <VisualizerControls />     {/* Toggle modes, particles, hue speed */}
                
                {/* --- AI GENERATOR CONTROLS --- */}
                <div className="p-4 border border-dashed border-gray-600 rounded bg-gray-900 bg-opacity-50">
                    <h3 className="text-sm font-bold text-gray-400 mb-2">RaveMind AI</h3>
                    <button 
                        onClick={handleToggleRave}
                        className={`w-full px-4 py-2 rounded font-bold text-white transition-all shadow-lg ${
                            isRaving 
                            ? 'bg-red-500 hover:bg-red-600 shadow-red-500/50' 
                            : 'bg-indigo-500 hover:bg-indigo-600 shadow-indigo-500/50'
                        }`}
                    >
                        {isRaving ? "STOP RAVE" : "START RAVE AI"}
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        {isRaving ? "Generating non-stop techno..." : "Click to generate beats"}
                    </p>
                </div>
                {/* ----------------------------- */}

            </div>
            <VisualizerCanvas />          {/* Where all visuals are drawn */}
        </div>
    );
}

export default App