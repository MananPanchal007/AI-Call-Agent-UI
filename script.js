const apiBase = "https://ai-call-agent-8dpv.onrender.com";

document.getElementById("infoForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const userName = document.getElementById("userName").value.trim();
  const amountDue = document.getElementById("amountDue").value.trim();
  const companyName = document.getElementById("companyName").value.trim();
  const phoneNumber = document.getElementById("phoneNumber").value.trim();
  const responseBox = document.getElementById("responseBox");

  responseBox.classList.add("d-none");
  responseBox.classList.remove("alert-success", "alert-danger");

  try {
    const setPromptRes = await fetch(`${apiBase}/set-caller-info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_name: userName, amount_due: amountDue, company_name: companyName }),
    });

    const promptData = await setPromptRes.json();
    if (promptData.error) throw new Error(promptData.error);

    const callRes = await fetch(`${apiBase}/call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number: phoneNumber }),
    });

    const callData = await callRes.json();
    if (callData.error) throw new Error(callData.error);

    responseBox.textContent = "✅ Call initiated successfully!";
    responseBox.classList.add("alert", "alert-success");
    loadCallHistory();
  } catch (err) {
    responseBox.textContent = `❌ ${err.message}`;
    responseBox.classList.add("alert", "alert-danger");
  }

  responseBox.classList.remove("d-none");
});

async function loadCallHistory() {
  const res = await fetch(`${apiBase}/call-history`);
  const data = await res.json();
  const list = document.getElementById("callHistoryList");
  list.innerHTML = "";

  for (const entry of data.history.reverse().slice(0, 5)) {
    const li = document.createElement("li");
    const time = new Date(entry.timestamp).toLocaleString();
    let text = `📞 ${entry.from_number || "Unknown"} → ${entry.to_number || "User"} at ${time} - ${entry.status}`;

    // Add download link for recording
    if (entry.call_sid) {
      try {
        const recRes = await fetch(`${apiBase}/recordings/mp3/${entry.call_sid}`);
        const recData = await recRes.json();
        if (recData.mp3_url) {
          const downloadLink = document.createElement("a");
          downloadLink.href = recData.mp3_url;
          downloadLink.target = "_blank";
          downloadLink.textContent = " 🎵 Download MP3";
          downloadLink.style.marginLeft = "8px";
          li.textContent = text;
          li.appendChild(downloadLink);
        } else {
          li.textContent = text;
        }
      } catch {
        li.textContent = text;
      }
    } else {
      li.textContent = text;
    }

    list.appendChild(li);
  }
}

window.onload = loadCallHistory;
