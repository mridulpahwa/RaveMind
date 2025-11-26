// src/ai/training/train_rhythm.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// This now works perfectly with the updated parser
import { parseMidiData } from '../midi/MidiParser.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const DATASET_DIR = path.resolve(__dirname, 'dataset');
const OUTPUT_FILE = path.resolve(__dirname, '../../../public/rhythm_model.json'); 

const GRID_STEPS = 32; // 2 bars of 16th notes
const ORDER = 2;       // Markov Order

// --- 1. QUANTIZER ---
function quantizeAndTokenize(data) {
    if (!data || !data.notes) return [];

    const { notes, bpm } = data;
    
    // Create empty grid
    const grid = Array(GRID_STEPS).fill(null).map(() => new Set());

    notes.forEach(note => {
        // Convert Time (Seconds) -> Grid Step
        // Formula: Time * (BPM / 60) * 4 (for 16th notes)
        const beats = note.start * (bpm / 60);
        const step = Math.round(beats * 4) % GRID_STEPS;
        
        // Add raw pitch to the set for this step
        grid[step].add(note.pitch);
    });

    // Tokenize: Convert Set -> String (e.g., "36-42")
    return grid.map(noteSet => {
        if (noteSet.size === 0) return "SILENCE";
        return Array.from(noteSet).sort((a, b) => a - b).join("-");
    });
}

// --- 2. TRAINER CLASS ---
class MarkovTrainer {
    constructor(order) {
        this.order = order;
        this.matrix = {};
    }

    train(sequence) {
        // Pad sequence to ensure the model learns how to loop
        const padded = [...sequence, ...sequence.slice(0, this.order)];

        for (let i = 0; i < sequence.length; i++) {
            const key = padded.slice(i, i + this.order).join("|"); 
            const next = padded[i + this.order];

            if (!this.matrix[key]) this.matrix[key] = {};
            if (!this.matrix[key][next]) this.matrix[key][next] = 0;
            
            this.matrix[key][next]++;
        }
    }

    normalize() {
        Object.keys(this.matrix).forEach(key => {
            const transitions = this.matrix[key];
            const total = Object.values(transitions).reduce((sum, n) => sum + n, 0);
            Object.keys(transitions).forEach(next => {
                transitions[next] = Number((transitions[next] / total).toFixed(4));
            });
        });
    }

    save(filepath) {
        fs.writeFileSync(filepath, JSON.stringify(this.matrix, null, 2));
        const size = (fs.statSync(filepath).size / 1024).toFixed(2);
        console.log(`Model saved to: ${filepath}`);
        console.log(`Size: ${size} KB`);
    }
}

// --- 3. RUNNER ---
async function run() {
    console.log(`Training on Groove MIDI (Order ${ORDER})...`);
    const trainer = new MarkovTrainer(ORDER);
    let filesProcessed = 0;

    try {
        const files = fs.readdirSync(DATASET_DIR).filter(f => f.endsWith('.mid') || f.endsWith('.midi'));

        if (files.length === 0) {
            console.error("No .mid files found in dataset folder!");
            return;
        }

        for (const fileName of files) {
            const data = await parseMidiData(fileName);
            if (data) {
                const tokens = quantizeAndTokenize(data);
                if (tokens.length > 0) {
                    trainer.train(tokens);
                    filesProcessed++;
                }
            }
        }

        if (filesProcessed > 0) {
            trainer.normalize();
            trainer.save(OUTPUT_FILE);
            console.log(`Success! Trained on ${filesProcessed} files.`);
        } else {
            console.warn("Processed 0 files. Check if your MIDI files have notes.");
        }

    } catch (err) {
        console.error("Error:", err);
    }
}

run();