// src/ai/midi/testParser.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseMidiData } from './MidiParser.js'; 

// --- CONFIGURATION ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Pointing to the dataset folder relative to this script
const DATASET_DIR = path.resolve(__dirname, '../training/dataset');

async function runTest() {
  console.log("Looking for MIDI files in:", DATASET_DIR);

  try {
    // 1. Auto-detect a .mid file to test
    const files = fs.readdirSync(DATASET_DIR).filter(f => f.endsWith('.mid') || f.endsWith('.midi'));

    if (files.length === 0) {
      console.error("No .mid files found! Please download Groove MIDI files into src/ai/training/dataset/");
      return;
    }

    const testFileName = files[0];
    console.log(`\nTesting file: ${testFileName}`);

    // 2. Run the Parser
    const result = await parseMidiData(testFileName);

    // 3. Validate Output
    if (result) {
      console.log("Parse Successful!");
      
      // Check BPM
      console.log(`\nBPM: ${result.bpm}`);

      // Check Notes
      if (result.notes && result.notes.length > 0) {
        console.log(`Total Notes: ${result.notes.length}`);
        console.log("First 5 Notes (Raw Data):");
        console.table(result.notes.slice(0, 5)); // Uses console.table for a nice readout
      } else {
        console.warn("Warning: No notes found in this file (or track selection logic failed).");
      }

    } else {
      console.error("Parser returned null.");
    }

  } catch (err) {
    console.error("Fatal Test Error:", err);
  }
}

runTest();