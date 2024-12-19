const endpointUrl = "http://127.0.0.1:11434/api/generate";

/**
 * Fetches a response from the Ollama API based on the provided model and prompt.
 *
 * @param {string} model - The model to use for generating a response.
 * @param {string} prompt - The prompt for which a response is required.
 * @returns {Promise<string>} - The API response or an error message.
 */
async function getResponse(model, prompt) {
  try {
    // Construct payload
    const payload = { model, prompt, stream: false };

    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Log raw response before parsing
    const rawResponse = await response.text();

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = JSON.parse(rawResponse); // Parse raw response
    return data.response;
  } catch (error) {
    console.error("Error details:", error);
    return `Error: ${error.message}`;
  }
}


module.exports = { getResponse };
