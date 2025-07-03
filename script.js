const API_KEY = "AIzaSyB9SgxKqX0PHxe_wWkR4mcsQlzTAWbQhiw";
const inputField = document.getElementById("user-input");
const chat = document.querySelector(".chat");

function appendMessage(text, className) {
  const msgDiv = document.createElement("div");
  msgDiv.className = className;
  msgDiv.innerHTML = `<p>${text}</p>`;
  chat.appendChild(msgDiv);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const userMessage = inputField.value.trim();
  if (!userMessage) return;

  appendMessage(userMessage, "user");
  inputField.value = "";

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: userMessage
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": API_KEY
        },
        body: JSON.stringify(requestBody)
      }
    );

    const resultText = await response.text();

    if (!response.ok) {
      throw new Error(`Status ${response.status}: ${resultText}`);
    }

    const data = JSON.parse(resultText);

    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    appendMessage(aiText, "model");
  } catch (error) {
    appendMessage("Error: " + error.message, "model");
  }
}

document.querySelector("button").addEventListener("click", sendMessage);
inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});