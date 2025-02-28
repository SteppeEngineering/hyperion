// tests/integration/ollamaIntegration_test.ts

import { assertEquals } from "https://deno.land/std@0.224.0/testing/asserts.ts";
import { generateScriptWithOllama } from "../../src/ollamaIntegration.ts";

Deno.test("Ollama Integration - should generate TypeScript script", async () => {
  const command = "Create a typescript script that adds two numbers.";
  const { script } = await generateScriptWithOllama(command);

  // Check if the script contains the function definition
  assertEquals(script.includes("function"), true);
  assertEquals(script.includes("add"), true);
});
