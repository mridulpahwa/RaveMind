// /src/visualizers/drawFrequencyBars.js
import { VisualizerState } from "../ui/Controls/AudioControls";

export default function drawFrequencyBars(ctx, canvas) {
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