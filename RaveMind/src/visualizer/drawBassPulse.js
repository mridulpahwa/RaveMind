// /src/visualizers/drawBassPulse.js
import { VisualizerState } from "../ui/Controls/AudioControls";

export default function drawBassPulse(ctx, canvas){
    const freq = VisualizerState.frequency;
    if (!freq || freq.length === 0) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // 1. Calculate average bass amplitude
    const bassBins = 10; // first 10 bins = low frequencies
    let bassSum = 0;
    for (let i = 0; i < bassBins; i++) {
        bassSum += freq[i];
    }
    const bassAvg = bassSum / bassBins;
    const bassNorm = bassAvg / 255; // normalized 0–1

    // 2. Map to radius
    const baseRadius = canvas.width * 0.1; // minimum radius
    const bassMax = canvas.width * 0.1;    // max extra radius
    const radius = baseRadius + bassNorm * bassMax;

    // 3. smooth animation
    if (!VisualizerState.bassRadius) VisualizerState.bassRadius = radius;
    VisualizerState.bassRadius = VisualizerState.bassRadius * 0.8 + radius * 0.2; //TODO : Decide if you want to add bassRadius to VisualizerState

    // 4. Draw the glowing circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, VisualizerState.bassRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `hsl(${VisualizerState.hue}, 100%, 50%)`;
    ctx.lineWidth = 8;
    ctx.shadowBlur = 20;
    ctx.shadowColor = `hsl(${VisualizerState.hue}, 100%, 50%)`;
    ctx.stroke();
    ctx.restore();
}