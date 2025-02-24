import { emitEvent, onEvent } from "./eventBus.ts";
import { generateScriptWithOllama } from "./ollamaIntegration.ts";

onEvent("userCommand", async (command) => {
  console.log(`📥 Received command: ${command}`);

  try {
    const { fullText, script } = await generateScriptWithOllama(command);

    console.log(`🤖 Full LLM Response:\n${fullText}`);
    console.log(`📝 Extracted TypeScript Code:\n${script}`);

    // Emit the extracted script for execution
    emitEvent("scriptGenerated", script);
  } catch (error) {
    console.error("❌ Error generating script:", error);
  }
});

onEvent("scriptGenerated", (script) => {
  console.log("⚙️ Processing extracted script for execution...");
  emitEvent("scriptExecution", script);
});

// Simulate user input
emitEvent("userCommand", "Rename all .txt files to .md");
