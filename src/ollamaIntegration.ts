import { config } from "./config.ts";

/**
 * Function to generate a TypeScript script using Ollama.
 * Processes streamed LLM response and extracts the code.
 */
export const generateScriptWithOllama = async (command: string): Promise<{ fullText: string; script: string }> => {
  const response = await fetch(`http://localhost:${config.OLLAMA_PORT}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.OLLAMA_MODEL,
      prompt: `Generate a TypeScript script that does the following:\n\n${command}\n\nRespond with an explanation followed by a code block.`,
      stream: true,
    }),
  });

  if (!response.body) {
    throw new Error("❌ No response body from Ollama.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let rawChunks: { created_at: string; response: string }[] = [];
  let seenResponses = new Set();
  let fullText = "";
  let script = "";
  let insideCodeBlock = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    let chunk = decoder.decode(value, { stream: true });

    // Process JSON objects from the response
    let jsonChunks = chunk.split("\n").filter(line => line.trim().startsWith("{"));

    for (let json of jsonChunks) {
      try {
        let parsed = JSON.parse(json);
        let text = parsed.response; // ⬅️ No trimming, preserving all spacing!

        if (!seenResponses.has(text)) {
          rawChunks.push(parsed);
          seenResponses.add(text);
        }
      } catch (error) {
        console.error("JSON Parsing Error:", error, "Chunk:", json);
      }
    }
  }

  // Sort responses by timestamp to reconstruct the correct order
  rawChunks.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // **🚀 Simply concatenate responses as-is**
  for (let { response } of rawChunks) {
    fullText += response; // No extra processing, just appending!
  }

  // Extract TypeScript code block
  const lines = fullText.split("\n");
  for (const line of lines) {
    if (line.includes("```typescript")) {
      insideCodeBlock = true;
      script = "";
      continue;
    } else if (line.includes("```") && insideCodeBlock) {
      insideCodeBlock = false;
      continue;
    }

    if (insideCodeBlock) {
      script += line + "\n";
    }
  }

  // Final cleanup for script
  script = script.trim();

  return { fullText, script };
};
