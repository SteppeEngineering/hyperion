// src/main.ts

import { emitEvent, onEvent } from "./eventBus.ts";
import { generateScriptWithOllama } from "./ollamaIntegration.ts";
import { handleAudioInput } from "./audioHandler.ts";

onEvent("userCommand", async (command) => {
  console.log(`📥 Received command: ${command}`);

  try {
    const { fullText, script } = await generateScriptWithOllama(command);

    console.log(`🤖 Full LLM Response:\n${fullText}`);
    console.log(`📝 Extracted TypeScript Code:\n${script}`);

    emitEvent("scriptGenerated", script);

    // Trigger WASM build if the command includes "WASM"
    if (command.toLowerCase().includes("wasm")) {
      emitEvent("wasmBuild", { command });
    }
  } catch (error) {
    console.error("❌ Error generating script:", error);
  }
});

onEvent("scriptGenerated", (script) => {
  console.log("⚙️ Processing extracted script for execution...");
  emitEvent("scriptExecution", script);
});

// Add this at the end of the file
if (import.meta.main) {
  const args = Deno.args;
  if (args[0] === "--audio") {
    if (args[1]) {
      handleAudioInput(args[1]);
    } else {
      console.error("Please provide a path to the audio file.");
      Deno.exit(1);
    }
  } else {
    console.log("Usage: deno run --allow-read --allow-run src/main.ts --audio <path-to-file>");
  }
}

// Simulate user input
//emitEvent("userCommand", "Build and run the WASM module");
