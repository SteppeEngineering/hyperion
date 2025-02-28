// src/wasmRunner.ts
import { emitEvent } from "./eventBus.ts";

const importObject = {
  env: {
    abort(_msg: number, _file: number, line: number, column: number) {
    console.error("abort called at index.ts:" + line + ":" + column);
   },
  },
};

export const executeWasm = async (wasmModulePath: string, args: number[] = []) => {
  try {
     const wasmResponse = await fetch(wasmModulePath);
     const buffer = await wasmResponse.arrayBuffer();
     const { instance } = await WebAssembly.instantiate(buffer, importObject);

   // Assuming the WASM module exports a function `add`
     if (typeof instance.exports.add === "function") {
       const result = instance.exports.add(...args);
       console.log(`✅ Wasm Execution Result: ${result}`);
       emitEvent("wasmResult", result);
     } else {
       throw new Error("❌ Wasm function 'add' not found.");
   }
 } catch (error) {
     console.error("❌ Wasm Execution Error:", error);
     emitEvent("wasmExecutionError", error);
 }
};

//async function runWasm() {
//  const wasmResponse = await fetch("src/wasm/module.wasm");
//  const buffer = await wasmResponse.arrayBuffer();
//  const { instance } = await WebAssembly.instantiate(buffer, importObject);
//  console.log(instance.exports.add(2, 3)); // Example usage
//}
//
//runWasm().catch(console.error);
