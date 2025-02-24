import { emitEvent, onEvent } from "./eventBus.ts";

// Listen for a user command event
onEvent("userCommand", (command) => {
  console.log(`📥 Received user command: ${command}`);
  // Simulate processing by emitting a scriptGenerated event
  emitEvent("scriptGenerated", `Generated script for: ${command}`);
});

// Listen for script generation events
onEvent("scriptGenerated", (script) => {
  console.log(`⚙️ Executing script: ${script}`);
  emitEvent("scriptExecution", `Running: ${script}`);
});

// Listen for script execution events
onEvent("scriptExecution", (status) => {
  console.log(`✅ Script execution status: ${status}`);
});

// Simulate a user command
console.log("🚀 Starting Hyperion...");
emitEvent("userCommand", "Rename all .txt files to .md");
