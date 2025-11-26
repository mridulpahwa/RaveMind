// src/ai/midi/MidiParser.js

import fs from 'fs';
import path from 'path';

// --- Import the default package, then extract Midi ---
import ToneMidi from '@tonejs/midi';
const { Midi } = ToneMidi; 
// ---------------------------------------------------------

// Helper to resolve paths in ESM
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Adjust path to point to: src/ai/training/dataset
const DATASET_PATH = path.resolve(__dirname, '../training/dataset');

/**
 * Parses a .mid file into a simplified format for the trainer.
 * @param {string} fileName 
 * @returns {Promise<Object | null>} { notes: [{pitch, start}], bpm }
 */
export async function parseMidiData(fileName) {
    // Construct absolute path to the file
    const filePath = path.resolve(DATASET_PATH, fileName);

    try {
        // Read binary data from disk
        const fileBuffer = fs.readFileSync(filePath);
        
        // Parse using Tonejs/midi
        const midi = new Midi(fileBuffer);

        // Get the first track (usually drums in Groove dataset)
        // Or find the track with the most notes to be safe
        const track = midi.tracks.reduce((prev, current) => 
            (prev.notes.length > current.notes.length) ? prev : current
        , midi.tracks[0]);

        if (!track || track.notes.length === 0) {
            console.warn(`⚠️  Warning: ${fileName} has no notes.`);
            return null;
        }

        // Extract clean data
        return {
            bpm: midi.header.tempos[0]?.bpm || 120,
            notes: track.notes.map(n => ({
                pitch: n.midi,
                start: n.time // Time in seconds
            }))
        };

    } catch (error) {
        console.error(`Error parsing ${fileName}:`, error.message);
        return null;
    }
}