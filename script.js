const apiBase = "https://ai-call-agent-8dpv.onrender.com"; // update if needed

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
    // Step 1: Set system prompt
    const setPromptRes = await fetch(`${apiBase}/set-caller-info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_name: userName, amount_due: amountDue, company_name: companyName }),
    });

    const promptData = await setPromptRes.json();

    if (promptData.error) {
      throw new Error(promptData.error);
    }

    // Step 2: Make the call
    const callRes = await fetch(`${apiBase}/call`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number: phoneNumber }),
    });

    const callData = await callRes.json();

    if (callData.error) {
      throw new Error(callData.error);
    }

    responseBox.textContent = "✅ Call initiated successfully!";
    responseBox.classList.add("alert", "alert-success");
  } catch (err) {
    responseBox.textContent = `❌ ${err.message}`;
    responseBox.classList.add("alert", "alert-danger");
  }

  responseBox.classList.remove("d-none");
});
