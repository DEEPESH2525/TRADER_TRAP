const form = document.getElementById("leadForm");
const statusEl = document.getElementById("formStatus");
const success = document.getElementById("success");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "Submitting…";
  statusEl.style.color = "#8a6500";

  const data = Object.fromEntries(new FormData(form).entries());
  data.age = Number(data.age);
  data.consent = true;

  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Submission failed");

    form.reset();
    statusEl.textContent = "";
    success.hidden = false;
    success.scrollIntoView({behavior:"smooth", block:"center"});
  } catch (err) {
    statusEl.textContent = "Unable to submit right now. Please try again.";
    statusEl.style.color = "#b42318";
    console.error(err);
  }
});
