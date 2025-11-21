import { useRef, useEffect } from "react";
import { VisualizerState } from "./AudioControls";
import drawWaveform from "../../visualizer/drawWaveform";
import drawFrequencyBars from "../../visualizer/drawFrequencyBars"
import drawRadialSpectrum from "../../visualizer/drawRadialSpectrum"
import drawBassPulse from "../../visualizer/drawBassPulse"

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
                        drawBassPulse(ctx, canvas)
                        break;
                    default:
                        drawWaveform(ctx, canvas);
                        drawFrequencyBars(ctx, canvas); // default combined view
                        break;
                }
                VisualizerState.rotation += 0.005;
                VisualizerState.hue = (VisualizerState.hue + 0.5) % 360; 
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