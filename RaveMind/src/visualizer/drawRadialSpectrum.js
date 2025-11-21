// /src/visualizers/drawRadialSpectrum.js
import { VisualizerState } from "../ui/Controls/AudioControls";

export default function drawRadialSpectrum(ctx, canvas) {

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

        const brightness = 40 + normalized * 40; // 40–80
        ctx.strokeStyle = `hsl(${VisualizerState.hue}, 100%, ${brightness}%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();
    }

    ctx.restore();
} 