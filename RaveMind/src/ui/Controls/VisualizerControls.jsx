import { useState } from "react";
import { VisualizerState } from "./AudioControls";

export default function VisualizerControls(){
    const [mode, setMode] = useState(VisualizerState.visualizerMode);
    const [particlesOn, setPartcilesOn] = useState(true);
    const [hueSpeed, setHueSpeed] = useState(VisualizerState.hueSpeed);

    // Update VisualizerState when UI changes
    const handleModeChange = (e) => {
        const value = e.target.value;
        setMode(value);
        VisualizerState.visualizerMode = value;
    };

    const toggleParticles = () => {
        setParticlesOn((prev) => !prev);
        VisualizerState.particlesOn = !VisualizerState.particlesOn;
    };

    const handleHueSpeedChange = (e) => {
        const value = parseFloat(e.target.value);
        setHueSpeed(value);
        VisualizerState.hueSpeed = value;
    };

    return (
        <div className="visualizer-controls p-4 bg-gray-900 text-white rounded-md flex flex-col gap-4 w-64">
            <label>
                Mode:
                <select value={mode} onChange={handleModeChange} className="ml-2 p-1 rounded bg-gray-800">
                    <option value="waveform">Waveform</option>
                    <option value="radial">Radial</option>
                    <option value="bars">Bars</option>
                </select>
            </label>

            <label>
                <input type="checkbox" checked={particlesOn} onChange={toggleParticles} />
                Particles
            </label>

            <label>
                Hue Speed: {hueSpeed.toFixed(2)}
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={hueSpeed}
                    onChange={handleHueSpeedChange}
                    className="w-full"
                />
            </label>
        </div>
    );
}