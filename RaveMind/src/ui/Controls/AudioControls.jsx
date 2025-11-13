//src/ui/Controls/AudioControls.jsx
import {useRef, useState} from "react";

//Shared Visualizer state
export const VisualizerState = {
    waveform: [],
    isPlaying: false,
    audioContext: null,
    sourceNode: null,
}

export default function AudioControls() {
    const fileInputRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        //Create Audio Context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        VisualizerState.audioContext = audioContext;

        //Read audio file
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        //Create a buffer source
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        VisualizerState.sourceNode = source;

        //Start Playing
        source.start();
        VisualizerState.isPlaying = true;
        setIsPlaying(true);

        //Simple waveform capture (placeholder)
        VisualizerState.waveform = audioBuffer.getChannelData(0).slice(0, 1024);
    };

    return (
        <div>
            <input
            type = "file"
            accept="audio/*"
            ref = {fileInputRef}
            onChange={handleFileChange}
            />
            <button onClick = {() => fileInputRef.current.click()}>
                Upload Audio
            </button>
            <span>{isPlaying ? "Playing" : "Paused"}</span>
        </div>
    );
}