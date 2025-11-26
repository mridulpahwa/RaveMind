// src/ai/generation/PatternGenerator.js

// import { throttle } from 'lodash'; // Optional, or use simple state checks

// --- CONFIGURATION ---
const MODEL_URL = '/rhythm_model.json'; // Files in /public are served at root
const ORDER = 2;

// --- RAVE FILTER (Clean up the dataset noise) ---
// We map complex MIDI notes to the 4 pillars of Techno.
// Any note NOT in this list will be ignored by the player.
const TECHNO_MAPPING = {
    35: 'kick', 36: 'kick',           // Kicks
    38: 'snare', 40: 'snare',         // Snares
    42: 'hat', 44: 'hat',             // Closed Hats
    46: 'openHat',                    // Open Hats
    // 41, 43, 45, etc. are ignored to keep the beat clean
};

class PatternGenerator {
    constructor() {
        this.model = null;
        this.isLoaded = false;
        
        // Initial state (Silence)
        // We need 'ORDER' amount of history to start generating.
        this.history = Array(ORDER).fill("SILENCE");
    }

    /**
     * Loads the JSON model from the public folder.
     */
    async loadModel() {
        try {
            console.log("AI: Loading Rhythm Model...");
            const response = await fetch(MODEL_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            this.model = await response.json();
            this.isLoaded = true;
            console.log("AI: Model Loaded. Ready to Rave.");
        } catch (error) {
            console.error("AI: Failed to load model:", error);
        }
    }

    /**
     * The Core Markov Logic.
     * Returns the next set of MIDI notes to play.
     */
    next() {
        if (!this.isLoaded || !this.model) return [];

        // 1. Construct Context Key (e.g., "36|42")
        const contextKey = this.history.join("|");

        // 2. Lookup Probabilities
        const transitions = this.model[contextKey];

        let nextToken = "SILENCE";

        if (transitions) {
            // 3. Weighted Random Selection
            nextToken = this.getWeightedRandom(transitions);
        } else {
            // Dead End? (Shouldn't happen often with order 2)
            // Fallback: Pick a random simple beat or Silence
            // For now, we just reset history to kickstart it again
            console.warn("AI: Lost the groove (Dead end). Resetting.");
            nextToken = "36"; // Kick start
            this.history = Array(ORDER).fill("SILENCE");
        }

        // 4. Update History (Slide window)
        this.history.shift();
        this.history.push(nextToken);

        // 5. Parse Token into Playable Data
        return this.parseToken(nextToken);
    }

    /**
     * Converts a token string (e.g., "36-42") into a clean array of drum names.
     */
    parseToken(token) {
        if (token === "SILENCE") return [];

        // Split "36-42-53" -> [36, 42, 53]
        const midiNotes = token.split("-").map(Number);

        // Filter & Map to Techno sounds
        // Uses a Set to avoid duplicate triggers (e.g., two kicks at once)
        const soundsToTrigger = new Set();

        midiNotes.forEach(note => {
            if (TECHNO_MAPPING[note]) {
                soundsToTrigger.add(TECHNO_MAPPING[note]);
            }
        });

        return Array.from(soundsToTrigger); // e.g., ['kick', 'hat']
    }

    getWeightedRandom(probObj) {
        let sum = 0;
        const r = Math.random();
        for (const [token, chance] of Object.entries(probObj)) {
            sum += chance;
            if (r <= sum) return token;
        }
        return Object.keys(probObj)[0];
    }

    /**
     * Starts the generation loop.
     * @param {Object} player - The MidiPlayer instance
     */
    start(player) {
        if (!this.isLoaded) {
            console.warn("⚠️ Cannot start: Model not loaded.");
            return;
        }

        // Initialize Audio Context
        player.initialize();

        // Import Tone here dynamically or pass it in, 
        // but since we are in a module, we can assume Tone is available if we installed it.
        // Ideally, this logic sits in a "Conductor" file, but we'll put it here for MVP.
        import('tone').then(Tone => {
            
            // Set Tempo (Techno standard)
            Tone.Transport.bpm.value = 128;

            // Schedule a repeating loop every 16th note
            Tone.Transport.scheduleRepeat((time) => {
                // 1. Ask Brain for next notes
                const nextNotes = this.next();
                
                // 2. Tell Voice to play them
                if (nextNotes.length > 0) {
                    player.play(nextNotes, time);
                }
            }, "16n");

            // Start the Clock
            Tone.Transport.start();
            console.log("▶️ RaveMind Generator Started");
        });
    }

    stop() {
        import('tone').then(Tone => {
            Tone.Transport.stop();
            Tone.Transport.cancel(); // Clear scheduled events
            console.log("Psst... (Music Stopped)");
        });
    }
}

// Export a singleton instance so the whole app shares one brain
export const patternGenerator = new PatternGenerator();