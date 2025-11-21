// /src/visualizers/drawWaveform.js
import { VisualizerState } from "../ui/Controls/AudioControls";

export default function drawWaveform(ctx, canvas) {
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