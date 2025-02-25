import { emitEvent, onEvent } from "./eventBus.ts";

// Function to execute TypeScript scripts securely
export const executeScript = async (script: string) => {
 try {
   // Create a temporary file for the script
   const tempFilePath = "tempScript.ts";
   await Deno.writeTextFile(tempFilePath, script);

   // Execute the TypeScript code directly with Deno
   const result = await Deno.run({
     cmd: ["deno", "run", "--allow-read", tempFilePath],
     stdout: "piped",
     stderr: "piped",
   });

   const output = new TextDecoder().decode(await result.output());
   const errorOutput = new TextDecoder().decode(await result.stderrOutput());

   if (errorOutput) {
     console.error("❌ Script Error:", errorOutput);
     emitEvent("scriptError", errorOutput);
   } else {
     console.log("✅ Script Output:", output);
     emitEvent("scriptResult", output);
   }

   result.close();
   await Deno.remove(tempFilePath); // Clean up the temporary file
 } catch (error) {
   console.error("❌ Execution Error:", error);
   emitEvent("scriptExecutionError", error);
 }
};

// Listen for scripts to execute
onEvent("scriptExecution", executeScript);

// CLI entry point for testing
if (import.meta.main) {
 const args = Deno.args;
 if (args.length === 0) {
   console.error("Please provide the path to a TypeScript file to execute.");
   Deno.exit(1);
 }

 const scriptPath = args[0];
 Deno.readTextFile(scriptPath)
   .then(scriptContent => executeScript(scriptContent))
   .catch(error => console.error("❌ Error reading script file:", error));
}
