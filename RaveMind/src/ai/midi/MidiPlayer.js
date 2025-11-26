// src/ai/midi/MidiPlayer.js
import * as Tone from 'tone';

class MidiPlayer {
    constructor() {
        this.initialized = false;
        
        // --- 1. THE INSTRUMENTS (Synthesizers) ---
        // Kick: Deep, punchy sine sweep
        this.kick = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 10,
            oscillator: { type: "sine" },
            envelope: {
                attack: 0.001,
                decay: 0.4,
                sustain: 0.01,
                release: 1.4,
                attackCurve: "exponential"
            }
        }).toDestination();

        // Snare: White noise burst + low tone
        this.snare = new Tone.NoiseSynth({
            noise: { type: "white" },
            envelope: {
                attack: 0.001,
                decay: 0.2,
                sustain: 0
            }
        }).toDestination();

        // Hi-Hat: Metallic, high-frequency noise
        this.hat = new Tone.MetalSynth({
            frequency: 200,
            envelope: {
                attack: 0.001,
                decay: 0.1,
                release: 0.01
            },
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 4000,
            octaves: 1.5
        }).toDestination();
        
        // Lower the volume slightly to prevent clipping
        this.kick.volume.value = -2;
        this.snare.volume.value = -5;
        this.hat.volume.value = -10;
    }

    /**
     * Browsers require a user gesture (click) to start audio.
     * Call this once when the user clicks "Play".
     */
    async initialize() {
        if (this.initialized) return;
        await Tone.start();
        this.initialized = true;
        console.log("🔊 Audio Engine Started");
    }

    /**
     * Plays a specific list of drums immediately.
     * @param {string[]} drums - e.g., ['kick', 'hat']
     * @param {number} time - Optional Tone.js time (default: now)
     */
    play(drums, time) {
        if (!this.initialized) return;
        
        const t = time || Tone.now();

        drums.forEach(drum => {
            if (drum === 'kick') {
                this.kick.triggerAttackRelease("C1", "8n", t);
            } else if (drum === 'snare') {
                this.snare.triggerAttackRelease("8n", t);
            } else if (drum === 'hat' || drum === 'openHat') {
                // Open hats are just longer decays in this simple synth
                const duration = drum === 'openHat' ? "8n" : "32n";
                this.hat.triggerAttackRelease(duration, t);
            }
        });
    }
}

// Export Singleton
export const midiPlayer = new MidiPlayer();