// /src/visualizers/drawParticles.js
import { VisualizerState } from "../ui/Controls/AudioControls";

const particles = [];

export function spawnParticle(x, y, color) {
    particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        alpha: 1,
        color
    });
}

export function updateParticles() {
    for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.01;  // fade out
    }

    // remove particles that are invisible
    for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].alpha <= 0) particles.splice(i, 1);
    }
}

export function drawParticles(ctx) {
    for (let p of particles) {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.globalAlpha = 1;
} 
