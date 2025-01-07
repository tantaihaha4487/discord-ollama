const endpointUrl = "http://127.0.0.1:11434/api/chat";


async function getResponse(model, chatHistory) {
  try {
    // Construct payload
    const payload = { model, messages: chatHistory, stream: false };

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
    console.log("API response:", data);
    return data.message.content;
  } catch (error) {
    console.error("Error details:", error);
    throw new error("Error details:", error);
  }
}


module.exports = { getResponse };
