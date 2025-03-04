// src/whisperTranscription.ts

import { emitEvent } from "./eventBus.ts";

export async function transcribeAudio(audioPath: string) {
  try {
    const command = new Deno.Command("whisper", {
      args: [audioPath, "--model", "tiny", "--language", "en", "--output_format", "txt"],
      stdout: "piped",
      stderr: "piped",
    });

    const { stdout, stderr } = await command.output();

    if (stderr.length > 0) {
      const errorMessage = new TextDecoder().decode(stderr);
      throw new Error(errorMessage);
    }

    const transcription = new TextDecoder().decode(stdout).trim();
    console.log("Transcription completed successfully");
    emitEvent("transcriptionCompleted", { transcription });
  } catch (error) {
    console.error(`Transcription error: ${error}`);
    emitEvent("transcriptionError", { error: error.message });
  }
}
