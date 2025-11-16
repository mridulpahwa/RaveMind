// src/ai/midi/MidiParser.js (or .mjs)

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// --- This path logic is correct ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATASET_PATH = path.resolve(__dirname, '../training/dataset');
// ---

/**
 * Reads and parses a JSON data file from the dataset directory.
 * @param {string} fileName - The name of the JSON file (e..g, "120bpm_hse_drm_id_001_0001.json")
 * @returns {Promise<object | null>} A promise that resolves to the *nested* data object.
 */
export async function parseMidiData(fileName) {
  
  const filePath = path.resolve(DATASET_PATH, fileName);

  try {
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContents);
    
    // --- FIX 1: UN-NEST THE DATA ---
    // The data is inside a key that matches the filename (without .json)
    // We find that key and return the object inside it.
    const dataKey = Object.keys(data)[0]; 
    if (data[dataKey]) {
      return data[dataKey]; // Return the *nested* object
    } else {
      throw new Error("Could not find nested data key.");
    }
    // --- END OF FIX ---

  } catch (error) {
    console.error(`Error in MidiParser reading ${filePath}:`, error);
    return null;
  }
}

/**
 * Reads and parses the drum key map.
 * @returns {Promise<object | null>} A promise that resolves to the *nested* key map.
 */
export async function getDrumKeyMap() {
  const filePath = path.resolve(DATASET_PATH, 'key_map_drum_note_labels.json'); 
  
  try {
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const keyMapData = JSON.parse(fileContents);

    // --- FIX 2: UN-NEST THE KEY MAP ---
    if (keyMapData.key_map_drum_note_labels) {
      return keyMapData.key_map_drum_note_labels; // Return the *nested* map
    } else {
      throw new Error("Could not find nested 'key_map_drum_note_labels' key.");
    }
    // --- END OF FIX ---

  } catch (error) {
    console.error("Error fetching key map:", error);
    return null;
  }
}