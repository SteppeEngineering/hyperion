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
      prompt: `Generate a TypeScript script that does the following:\n\n${command}\n\nRespond with an explanation followed by a properly formatted TypeScript code block.`,
      stream: true,
    }),
  });

  if (!response.body) {
    throw new Error("❌ No response body from Ollama.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let rawChunks: { created_at: string; response: string }[] = [];
  let lastResponses: string[] = []; // Ordered list to track last responses
  let fullText = "";
  let script = "";
  let insideCodeBlock = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    let chunk = decoder.decode(value, { stream: true });

    console.log("🔹 Chunk received:", chunk);

    // Process JSON objects from the response
    let jsonChunks = chunk.split("\n").filter(line => line.trim().startsWith("{"));

    for (let json of jsonChunks) {
      try {
        let parsed = JSON.parse(json);
        console.log("✅ Parsed:", parsed);
        let text = parsed.response; // Keep original spacing!

        // ✅ Only filter duplicates based on **last few responses**
        if (lastResponses.length === 0 || lastResponses[lastResponses.length - 1] !== text) {
          rawChunks.push(parsed);
          lastResponses.push(text);

          // Keep only the last 10 tokens in memory to check for repetition
          if (lastResponses.length > 10) {
            lastResponses.shift();
          }
        }
      } catch (error) {
        console.error("❌ JSON Parsing Error:", error, "Chunk:", json);
      }
    }
  }

  // Sort responses by timestamp to reconstruct the correct order
  rawChunks.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // **🔹 Save sorted chunks to a file for debugging**
  try {
    await Deno.writeTextFile("sorted_chunks.json", JSON.stringify(rawChunks, null, 2));
    console.log("✅ Saved sorted LLM responses to sorted_chunks.json");
  } catch (err) {
    console.error("❌ Error saving sorted_chunks.json:", err);
  }

  // **🚀 Concatenate responses as-is**
  for (let { response } of rawChunks) {
    fullText += response;
  }

  // **🔥 Extract the first TypeScript code block**
  const lines = fullText.split("\n");
  for (const line of lines) {
    if (line.includes("```typescript")) {
      insideCodeBlock = true;
      script = ""; // Reset script buffer to capture only this block
      continue;
    } else if (line.includes("```") && insideCodeBlock) {
      insideCodeBlock = false;
      break; // Stop capturing after the closing backticks
    }

    if (insideCodeBlock) {
      script += line + "\n";
    }
  }

  return { fullText, script: script.trim() };
};
