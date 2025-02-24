// Import the generated JavaScript bindings from wasm-pack
import init, { add } from "../rust-wasm/pkg/hyperion_wasm.js";

async function runWasm() {
  // Initialize the Wasm module
  await init();

  // Call the exported function
  console.log("✅ Wasm Result:", add(5, 10)); // Expected output: 15
}

runWasm();
