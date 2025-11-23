//src/ui/Controls/AudioControls.jsx
import {useRef, useState} from "react";

//Shared Visualizer state
export const VisualizerState = {
    visualizerMode : "radial", // "waveform" | "bars" | "radial"
    rotation : 0,
    hue: 0,
    hueSpeed: 0.005,
    waveform: [],
    isPlaying: false,
    audioContext: null,
    sourceNode: null,
    analyser: null,
    frequency: [],
    particlesOn : true, // TODO : use this in Visualizer Canvas
}

export default function AudioControls() {
    const fileInputRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        //Create Audio Context
        if (!VisualizerState.audioContext){
        const audioContext = new (window.AudioContext)();
        VisualizerState.audioContext = audioContext;
        }
        //Read audio file
        const arrayBuffer = await file.arrayBuffer();
        const audioBuffer = await VisualizerState.audioContext.decodeAudioData(arrayBuffer);

        if (VisualizerState.sourceNode) {
            VisualizerState.sourceNode.stop();  // stop previous
        }


        //Create a buffer 
        const source = VisualizerState.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(VisualizerState.audioContext.destination);
        VisualizerState.sourceNode = source;

        if (!VisualizerState.analyser){
        const analyser = VisualizerState.audioContext.createAnalyser();
        analyser.fftSize = 2048;
        const bufferLength = analyser.fftSize;
        const dataArray = new Float32Array(bufferLength)

        VisualizerState.analyser = analyser;
        VisualizerState.waveform = new Float32Array(analyser.fftSize);
        VisualizerState.frequency = new Uint8Array(VisualizerState.analyser.frequencyBinCount)
        }

        source.connect(VisualizerState.analyser);
        VisualizerState.analyser.connect(VisualizerState.audioContext.destination);
        //Start Playing
        source.start();
        VisualizerState.isPlaying = true;
        setIsPlaying(true);
    };


    const togglePlayPause = async() => {
       
        if (!VisualizerState.audioContext) return;
        if (VisualizerState.audioContext.state === "running"){
            await VisualizerState.audioContext.suspend();
            setIsPlaying(false);
            VisualizerState.isPlaying = false;
            
        } else if (VisualizerState.audioContext.state === "suspended"){
            await VisualizerState.audioContext.resume();
            setIsPlaying(true);
            VisualizerState.isPlaying = true;
        }
    };


    return (
        <div className="flex items-center gap-2">
            {/* Hidden file input */}
            <input
                type="file"
                accept="audio/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />

            {/* Buttons */}
            <button onClick={() => fileInputRef.current?.click()}>
                Upload Audio
            </button>
            <button onClick={togglePlayPause}>
                {isPlaying ? "Pause" : "Play"}
            </button>
        </div>
    );
}