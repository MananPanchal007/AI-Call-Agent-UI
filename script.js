const apiBase = "https://ai-call-agent-8dpv.onrender.com"; // Adjust if needed

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

  data.history.reverse().slice(0, 5).forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `📞 ${entry.from_number || "Unknown"} → ${entry.to_number || "User"} at ${new Date(entry.timestamp).toLocaleString()} - ${entry.status}`;
    list.appendChild(li);
  });
}

window.onload = loadCallHistory;
