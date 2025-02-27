import { emitEvent, onEvent } from "./eventBus.ts";

// Function to execute TypeScript scripts securely
export const executeScript = async (script: string, args: string[] = []) => {
  try {
    // Create a temporary file for the script
    const tempScriptPath = "tempScript.ts";
    await Deno.writeTextFile(tempScriptPath, script);

    // Execute the TypeScript code directly with Deno
    const process = Deno.run({
      cmd: ["deno", "run", "--allow-read", "--allow-write", tempScriptPath, ...args],
      stdout: "piped",
      stderr: "piped",
    });

    const output = new TextDecoder().decode(await process.output());
    const errorOutput = new TextDecoder().decode(await process.stderrOutput());

    if (errorOutput) {
      console.error("❌ Script Error:", errorOutput);
      emitEvent("scriptError", errorOutput);
    } else {
      console.log("✅ Script Output:", output);
      emitEvent("scriptResult", output);
    }

    process.close();
    await Deno.remove(tempScriptPath); // Clean up the temporary file
  } catch (error) {
    console.error("❌ Execution Error:", error);
    emitEvent("scriptExecutionError", error);
  }
};

// Listen for scripts to execute
onEvent("scriptExecution", (payload) => {
  const { script, args } = payload;
  executeScript(script, args);
});

// CLI entry point for testing
if (import.meta.main) {
  const args = Deno.args;
  if (args.length === 0) {
    console.error("Please provide the path to a TypeScript file to execute.");
    Deno.exit(1);
  }

  const scriptPath = args[0];
  const scriptArgs = args.slice(1);

  Deno.readTextFile(scriptPath)
    .then(scriptContent => executeScript(scriptContent, scriptArgs))
    .catch(error => console.error("❌ Error reading script file:", error));
}
