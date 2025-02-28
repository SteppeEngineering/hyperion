// src/eventBus.ts

import { Subject } from "https://esm.sh/rxjs@7.8.1";
import { executeWasm } from "./wasmRunner.ts";

// Define an event type structure
interface Event {
  type: string;
  payload?: any;
}

// Create an event bus using RxJS Subject
const eventBus = new Subject<Event>();

// Function to emit (publish) events
export const emitEvent = (type: string, payload?: any) => {
  eventBus.next({ type, payload });
};

// Function to listen (subscribe) to events
export const onEvent = (type: string, callback: (payload: any) => void) => {
  eventBus.subscribe(({ type: eventType, payload }) => {
    if (eventType === type) callback(payload);
  });
};

// New event listener for wasm execution
onEvent("wasmExecution", (payload) => {
  const { wasmModulePath, args } = payload;
  executeWasm(wasmModulePath, args);
});

onEvent("wasmBuild", async (payload) => {
  const { command } = payload;
  try {
    console.log("🔨 Building WASM module...");
    const cmd = new Deno.Command("npm", {
      args: ["run", "asbuild"],
      stdout: "piped",
      stderr: "piped",
    });

    const process = cmd.spawn();

		const { stdout, stderr } = await process.output();  // Await the output
    // Output and error handling
    const output = new TextDecoder().decode(stdout);
    const errorOutput = new TextDecoder().decode(stderr);

    if (errorOutput) {
      console.error("❌ Build Error:", errorOutput);
      emitEvent("wasmBuildError", errorOutput);
    } else {
      console.log("✅ Build Output:", output);
      emitEvent("wasmExecution", { wasmModulePath: "src/wasm/module.wasm", args: [2, 3] }); // Example args
    }

  } catch (error) {
    console.error("❌ Build Execution Error:", error);
    emitEvent("wasmBuildExecutionError", error);
  }
});
