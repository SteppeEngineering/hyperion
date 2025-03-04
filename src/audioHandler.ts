import { emitEvent } from "./eventBus.ts";

export async function handleAudioInput(audioPath: string) {
  try {
    // Check if the file exists
    await Deno.stat(audioPath);
    
    console.log(`Processing audio file: ${audioPath}`);
    
    // Emit an event to trigger the transcription process
    emitEvent("audioInputReceived", { audioPath });
  } catch (error) {
    console.error(`Error handling audio input: ${error}`);
    emitEvent("audioInputError", { error: error.message });
  }
}

// For future implementation: handle microphone input
export function handleMicrophoneInput() {
  console.log("Microphone input not yet implemented");
  // TODO: Implement microphone input handling
}
