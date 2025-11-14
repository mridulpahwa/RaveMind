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
                }
                //Clear the canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
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