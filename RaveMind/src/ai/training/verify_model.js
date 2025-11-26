// src/ai/training/verify_model.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODEL_PATH = path.resolve(__dirname, '../../../public/rhythm_model.json');

// Helper: Pick a random next state based on weights
function weightedRandom(probObj) {
    let sum = 0;
    const r = Math.random();
    for (const [token, chance] of Object.entries(probObj)) {
        sum += chance;
        if (r <= sum) return token;
    }
    // Fallback if rounding errors prevent 1.0 sum (return first key)
    return Object.keys(probObj)[0];
}

async function verify() {
    console.log("Loading Model...");
    
    if (!fs.existsSync(MODEL_PATH)) {
        console.error("Model file not found!");
        return;
    }

    const modelData = fs.readFileSync(MODEL_PATH, 'utf-8');
    const model = JSON.parse(modelData);
    const keys = Object.keys(model);
    
    console.log(`Model Loaded! Contains ${keys.length} unique state transitions.`);

    // --- GENERATION SIMULATION ---
    console.log("\nGenerating a 16-step (1 Bar) Loop:\n");

    // 1. Pick a random starting point (Order 2 context)
    // We look for a key that starts with a Kick (36) or Hat (42) for realism
    let currentKey = keys.find(k => k.includes("36") || k.includes("42")) || keys[0];
    
    // History buffer for Order 2 [step-2, step-1]
    let history = currentKey.split('|'); 

    const sequence = [];

    // 2. Generate 16 steps
    for (let i = 0; i < 16; i++) {
        const contextKey = history.join("|");
        
        // Lookup probabilities
        const possibilities = model[contextKey];

        if (!possibilities) {
            console.log(`   [End of Chain at step ${i}] - No data for ${contextKey}`);
            break;
        }

        // Pick next
        const nextToken = weightedRandom(possibilities);
        sequence.push(nextToken);

        // Update History: Drop oldest, add new
        history.shift();
        history.push(nextToken);
    }

    // 3. Print the Result
    console.log("Step | Token (Midi Notes)");
    console.log("-----|-------------------");
    sequence.forEach((token, index) => {
        // Pretty print: 36=Kick, 38=Snare, 42=Hat
        let name = token;
        if (token.includes("36")) name += " (Kick)";
        if (token.includes("38")) name += " (Snare)";
        if (token.includes("42")) name += " (Hat)";
        
        console.log(` ${String(index + 1).padEnd(3)} | ${name}`);
    });
}

verify();