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
                        drawRadialSpectrum(ctx, canvas);
                        break;
                    default:
                        drawWaveform(ctx, canvas);
                        drawFrequencyBars(ctx, canvas); // default combined view
                        break;
                }
                VisualizerState.rotation += 0.005;  
                requestAnimationFrame(draw);
            }
            draw();
        }, []);

        return (
            <canvas
            ref = {canvasRef}
            width={600}       
            height={600}  
            style = {{ width: "100%", height: "auto", background: "#111" }}
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

function drawRadialSpectrum(ctx, canvas) {
    
    const freq = VisualizerState.frequency;
    if (!freq || freq.length === 0) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Save state
    ctx.save();

    // Move origin to center
    ctx.translate(cx, cy);

    // Apply rotation
    ctx.rotate(VisualizerState.rotation);

    // Move origin back
    ctx.translate(-cx, -cy);


    const radius = Math.min(cx, cy) * 0.4; // radius for inner circle
    const barMaxHeight = radius * 0.8; // max bar length

    const count = freq.length;
    const angleStep = (Math.PI * 2) / count;

    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;

        const amp = freq[i];
        const normalized = amp / 255;   // 0–1
        const barLength = normalized * barMaxHeight;

        // Inner base of the bar
        const baseX = cx + radius * Math.cos(angle);
        const baseY = cy + radius * Math.sin(angle);

        // Outer tip of the bar
        const tipX = cx + (radius + barLength) * Math.cos(angle);
        const tipY = cy + (radius + barLength) * Math.sin(angle);

        ctx.strokeStyle = "#00eaff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();
    }

    ctx.restore();
} 

function drawParticles(ctx, canvas) {} 