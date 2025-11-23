import { useState } from "react";
import { VisualizerState } from "./AudioControls";

export default function VisualizerControls(){
    const [mode, setMode] = useState(VisualizerState.visualizerMode);
    const [particlesOn, setParticlesOn] = useState(true);
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
    <div className="visualizer-controls">
        <label className="control-group">
            <span className="control-label">Mode</span>
            <select
                value={mode}
                onChange={handleModeChange}
                className="control-select"
            >
                <option value="waveform">Waveform</option>
                <option value="radial">Radial</option>
                <option value="bars">Bars</option>
            </select>
        </label>

        <label className="control-group checkbox-group">
            <input
                type="checkbox"
                checked={particlesOn}
                onChange={toggleParticles}
            />
            <span className="control-label">Particles</span>
        </label>

        <label className="control-group">
            <span className="control-label">
                Hue Speed: {hueSpeed.toFixed(2)}
            </span>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={hueSpeed}
                onChange={handleHueSpeedChange}
                className="control-slider"
            />
        </label>
    </div>
);
}