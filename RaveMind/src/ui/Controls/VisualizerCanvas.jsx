import { useRef, useEffect } from "react";
import { VisualizerState } from "./AudioControls";

export default function VisualizerCanvas(){
    const canvasRef = useRef(null);

    useEffect (
        () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            // Resze to fit parent
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            function draw() {
                if (!ctx) return;
                
                //Update waveform for every 1024 frames
                if (VisualizerState.analyser){
                    VisualizerState.analyser.getFloatTimeDomainData(VisualizerState.waveform);
                    VisualizerState.analyser.getByteFrequencyData(VisualizerState.frequency);
                }
                //Clear the canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                switch (VisualizerState.visualizerMode){
                    case "waveform":
                        drawWaveform(ctx, canvas);
                        break;
                    case "bars":
                        drawFrequencyBars(ctx, canvas);
                        break;
                    case "radial":
                        drawRadialSpectrum
                        break;
                    default:
                        drawWaveform(ctx, canvas);
                        drawFrequencyBars(ctx, canvas); // default combined view
                        break;
                }  
                requestAnimationFrame(draw);
            }
            draw();
        }, []);

        return (
            <canvas
            ref = {canvasRef}
            style = {{ width: "100%", height: "300px", background: "#111" }}
            />
        );
}

function drawWaveform(ctx, canvas) {
    const waveform = VisualizerState.waveform;
    if (VisualizerState && waveform.length > 0) {
    ctx.beginPath();
                    
    const step = canvas.width / waveform.length;

    waveform.forEach((val, i) => {
        const x = i * step;
        const y = canvas.height / 2 + val * canvas.height / 2; // scale to canvas
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
        ctx.strokeStyle = "#00ffea";
        ctx.lineWidth = 2;
        ctx.stroke();
        }
}

function drawFrequencyBars(ctx, canvas) {
    const freq = VisualizerState.frequency;
    const barWidth = canvas.width / freq.length;
    for (let i = 0; i < freq.length; i++) {
    const barHeight = freq[i]; // 0–255 amplitude
    ctx.fillStyle = "white";   // simple for now

    ctx.fillRect(
        i * barWidth,
        canvas.height - barHeight,
        barWidth,
        barHeight
        );
        }     
}

function drawRadialSpectrum(ctx, canvas) {} 

function drawParticles(ctx, canvas) {} 