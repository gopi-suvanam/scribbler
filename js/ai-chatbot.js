/***** Chatbot AI Query Logic *****/
async function queryAIChatbot(userMessage) {
  const specialFunctionsFetch = await fetch("/SPECIAL-FUNCTIONS.md");
  const specialFunctions = await specialFunctionsFetch.text();

  // Determine if the user wants code
  const wantsCode = /code|javascript|html|function|snippet|example/i.test(userMessage);

  let instructions = `You are a helpful AI assistant.
Answer the user's questions clearly and concisely.
Do NOT include Markdown, HTML, or special functions unless the user explicitly asks for code or to use special functions.
Provide plain text answers by default.`;

  if (wantsCode) {
    instructions += `\nIf code is requested, you may use these special functions if applicable: ${specialFunctions}.
Provide only the requested code (JS, HTML, or both), without <body> or <script> tags.
Do not include any explanations unless specifically asked.`;
  }

  const prompt = `User query: ${userMessage}`;

  // Use API or local model
  if (window.preferredAIAPI) {
    try {
      const secretStore = localStorage.getItem('api-keys');
      let apiKey = null;
      if (window.preferredAIAPI !== 'OpenVino') {
        apiKey = JSON.parse(secretStore)[window.preferredAIAPI];
      }

      const response = await APIWrapper.call(window.preferredAIAPI, apiKey, {
        prompt: instructions + "\n" + prompt
      });

      return response;
    } catch (err) {
      throw new Error(err.message || "Failed to query AI API.");
    }
  } else if (window.llmEngine) {
    const messages = [
      { role: "system", content: instructions },
      { role: "user", content: prompt },
    ];

    const chunks = await llmEngine.chat.completions.create({
      messages,
      temperature: 1,
      stream: false
    });

    let finalReply = "";
    if (typeof chunks === "string") {
      finalReply = chunks;
    } else {
      for (const chunk of chunks.choices || []) {
        finalReply += chunk.delta?.content || "";
      }
    }

    return finalReply;
  } else {
    throw new Error("No AI model loaded. Please select a model or API.");
  }
}

/***** Chatbot UI Integration *****/
function initChatbot() {
  const toggleBtn = document.getElementById("ai-chat-toggle");
  const chatWindow = document.getElementById("ai-chat-window");
  const closeBtn = document.getElementById("ai-chat-close");
  const sendBtn = document.getElementById("ai-chat-send");
  const inputField = document.getElementById("ai-chat-input");
  const messagesDiv = document.getElementById("ai-chat-messages");
  const expandBtn = document.getElementById("ai-chat-expand");

  if (!toggleBtn || !chatWindow || !closeBtn || !sendBtn || !inputField || !messagesDiv || !expandBtn) {
    setTimeout(initChatbot, 200);
    return;
  }

  toggleBtn.addEventListener("click", () => chatWindow.classList.toggle("hidden"));
  closeBtn.addEventListener("click", () => chatWindow.classList.add("hidden"));
  expandBtn.addEventListener("click", () => chatWindow.classList.toggle("fullscreen"));

  sendBtn.addEventListener("click", sendMessage);
  inputField.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });
}

async function sendMessage() {
  const inputField = document.getElementById("ai-chat-input");
  const messagesDiv = document.getElementById("ai-chat-messages");
  const message = inputField.value.trim();
  if (!message) return;

  // --- User message ---
  const userMsg = document.createElement("div");
  userMsg.className = "chat-message user-message";
  userMsg.textContent = message;
  messagesDiv.appendChild(userMsg);
  inputField.value = "";

  // --- Bot loader ---
  const botMsg = document.createElement("div");
  botMsg.className = "chat-message bot-message";
  botMsg.innerHTML = `<span class="loader"></span>`;
  messagesDiv.appendChild(botMsg);

  try {
    if (!window.preferredAIAPI && !window.llmEngine) {
      throw new Error("AI not initialized. Please select a model or API.");
    }

    // --- Grab code from current active cell only ---
    let cellCode = "";
    const activeCell = document.querySelector('[id^="input"]');
    if (activeCell) {
      const codeElement = activeCell.querySelector("textarea, .cell-code");
      if (codeElement) {
        cellCode = codeElement.value || codeElement.textContent;
      }
    }

    // --- Prepare AI prompt ---
    let fullPrompt = "The following code is in the current notebook cell:\n" +
                     (cellCode || "[No code detected]") +
                     "\n\nDeveloper question: " + message +
                     "\nPlease provide a clear answer or code modification.";

    const reply = await queryAIChatbot(fullPrompt);

    // --- Format AI code output if needed ---
    const isCode = /```[\s\S]*```/.test(reply) || /<\w+>/.test(reply);
    if (isCode) {
      const pre = document.createElement("pre");
      pre.className = "chat-code";
      pre.textContent = reply.replace(/```/g, "");
      botMsg.innerHTML = "";
      botMsg.appendChild(pre);
    } else {
      botMsg.textContent = reply;
    }

  } catch (err) {
    botMsg.textContent = err.message || "Something went wrong. Check your API/model.";
  }

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}


document.addEventListener("DOMContentLoaded", initChatbot);
