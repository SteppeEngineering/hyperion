// src/transcriptionProcessor.ts

import { emitEvent } from "./eventBus.ts";

export function processTranscription(transcription: string) {
  // Simple processing: convert to lowercase and trim
  const processedCommand = transcription.toLowerCase().trim();
  
  console.log(`Processed transcription: ${processedCommand}`);
  emitEvent("userCommand", processedCommand);
}
