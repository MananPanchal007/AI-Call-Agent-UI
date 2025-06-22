const API_BASE = "https://ai-call-agent-8dpv.onrender.com"; // change to your Render backend URL

// Call API
document.getElementById("callForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const phone = document.getElementById("phoneNumber").value;
  const callStatus = document.getElementById("callStatus");
  callStatus.innerHTML = "📞 Calling...";

  try {
    const res = await fetch(`${API_BASE}/call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number: phone })
    });
    const data = await res.json();

    if (data.sid) {
      callStatus.innerHTML = `<span class="text-success">✅ Call started! SID: ${data.sid}</span>`;
    } else {
      callStatus.innerHTML = `<span class="text-danger">❌ Error: ${data.error}</span>`;
    }
  } catch (err) {
    callStatus.innerHTML = `<span class="text-danger">❌ Error: ${err.message}</span>`;
  }
});

// Prompt API
document.getElementById("promptForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const prompt = document.getElementById("systemPrompt").value;
  const promptStatus = document.getElementById("promptStatus");

  promptStatus.innerHTML = "🧠 Updating prompt...";

  try {
    const res = await fetch(`${API_BASE}/system-prompt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt })
    });
    const data = await res.json();

    if (data.message) {
      promptStatus.innerHTML = `<span class="text-success">✅ ${data.message}</span>`;
    } else {
      promptStatus.innerHTML = `<span class="text-danger">❌ Error: ${data.error}</span>`;
    }
  } catch (err) {
    promptStatus.innerHTML = `<span class="text-danger">❌ Error: ${err.message}</span>`;
  }
});
