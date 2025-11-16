// src/ai/midi/testParser.js (or .mjs)

// Make sure this import path is correct for your file (.js or .mjs)
import { parseMidiData, getDrumKeyMap } from './MidiParser.js'; 

// --- This is our test runner ---
async function runTest() {
  
  console.log("--- 1. Testing getDrumKeyMap() ---");
  const keyMap = await getDrumKeyMap();
  
  if (keyMap) {
    console.log("Key map loaded successfully!");
    // We'll just log the first 10 keys, since we know '36' is undefined.
    console.log("First 10 keys in map:", Object.keys(keyMap).slice(0, 10));
  } else {
    console.log("Key map FAILED to load.");
  }

  console.log("\n--- 2. Testing parseMidiData() ---");
  // This filename is correct from last time
  const testFileName = '120bpm_hse_drm_id_001_0001.json'; 
  
  const midiData = await parseMidiData(testFileName);

  if (midiData) {
    console.log(`Data for ${testFileName} loaded successfully!`);
    console.log("Available keys:", Object.keys(midiData)); // Should print ['pitch', 'tempo']

    // --- FINAL FIX ---
    // The data is in 'pitch', not 'midi_notes'.
    // Let's log the 'pitch' array.
    console.log("First 10 'pitch' values:", midiData.pitch.slice(0, 10));
    
    // Let's also see what's in 'tempo'
    console.log("Tempo value:", midiData.tempo);
  } else {
    console.log(`Data for ${testFileName} FAILED to load.`);
  }
}

// Execute the test
runTest();