import { config } from "./config.ts";

/**
 * Function to generate a TypeScript script using Ollama.
 * This function sends a prompt to the local Ollama API and processes the streamed response.
 * @param {string} command - The user's command describing the required script.
 * @returns {Promise<{ fullText: string; script: string }>} - The full response text and extracted script.
 */
export const generateScriptWithOllama = async (command: string): Promise<{ fullText: string; script: string }> => {
  // Send a POST request to Ollama API to generate the script
  const response = await fetch(`http://localhost:${config.OLLAMA_PORT}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.OLLAMA_MODEL, // Specifies the LLM model to use
      prompt: `Generate a TypeScript script that does the following:\n\n${command}\n\nRespond with an explanation followed by a code block.`,
      stream: true, // Enables streaming response for incremental processing
    }),
  });

  // If no response body is received, throw an error
  if (!response.body) {
    throw new Error("❌ No response body from Ollama.");
  }

  // Create a reader to process the streamed response
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  // Variables to store response data
  let rawChunks: { created_at: string; response: string }[] = []; // Stores individual response chunks with timestamps
  let seenResponses = new Set(); // Ensures duplicate responses aren't added
  let fullText = ""; // The full reconstructed response
  let script = ""; // The extracted TypeScript script
  let insideCodeBlock = false; // Tracks whether we are inside a TypeScript code block
  let prevWordFragment = ""; // Stores a partial word from the previous chunk if needed

  // Process streamed data until completion
  while (true) {
    const { done, value } = await reader.read();
    if (done) break; // Stop reading when the stream ends

    // Decode the chunk into a UTF-8 string
    let chunk = decoder.decode(value, { stream: true }).trim();

    // Extract JSON response lines (each line is a JSON object)
    let jsonChunks = chunk.split("\n").filter(line => line.trim().startsWith("{"));

    for (let json of jsonChunks) {
      try {
        let parsed = JSON.parse(json); // Parse JSON
        let text = parsed.response.trim(); // Extract the actual response text

        // Add the response only if it's not a duplicate
        if (!seenResponses.has(text)) {
          rawChunks.push(parsed);
          seenResponses.add(text);
        }
      } catch (error) {
        console.error("JSON Parsing Error:", error, "Chunk:", json);
      }
    }
  }

  // Sort response chunks by timestamp to reconstruct the correct order
  rawChunks.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // Iterate through sorted chunks to reconstruct the full text response
  for (let { response } of rawChunks) {
    //response = response.trim(); // Trim any extra spaces

    // Handle cases where words are split across tokens (e.g., "ren" + "ame" → "rename")
    if (prevWordFragment && /^[a-zA-Z]/.test(response)) {
      fullText += response; // Merge with previous word fragment
      prevWordFragment = "";
    }
    // Check if the current response is a standalone word (no punctuation)
    else if (response.match(/^[a-zA-Z]+$/)) {
      if (prevWordFragment) {
        fullText += response; // Merge with previous fragment
        prevWordFragment = "";
      } else {
        fullText += (fullText ? " " : "") + response; // Add space if it's not the first word
      }
    }
    // If it's a punctuation mark, append without a space before it
    else if (/[-.,'";:!?]/.test(response)) {
      fullText += response;
    }
    // Otherwise, append normally with a space
    else {
      fullText += (fullText ? " " : "") + response;
    }

    // Store the last fragment if it's an incomplete word
    if (response.match(/([a-zA-Z]+)-$/) || response.match(/^[a-zA-Z]+$/) && response.length <= 3) {
      prevWordFragment = response;
    } else {
      prevWordFragment = "";
    }
  }

  // Final cleanup: Remove unnecessary spaces before punctuation
  fullText = fullText.replace(/\s+([.,!?])/g, "$1").replace(/\s+/g, " ").trim();

  // Extract TypeScript code block from the response
  const lines = fullText.split("\n");
  for (const line of lines) {
    if (line.includes("```typescript")) {
      insideCodeBlock = true; // Start capturing code
      script = ""; // Reset script content
      continue;
    } else if (line.includes("```") && insideCodeBlock) {
      insideCodeBlock = false; // Stop capturing code
      continue;
    }

    if (insideCodeBlock) {
      script += line + "\n"; // Append line to script content
    }
  }

  // Final cleanup for the extracted script
  script = script.replace(/\s+/g, " ").trim();

  return { fullText, script };
};
