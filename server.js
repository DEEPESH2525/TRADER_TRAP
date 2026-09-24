const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "submissions.json");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, "[]");

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/", rateLimit({ windowMs: 15 * 60 * 1000, max: 50 }));

function clean(value, max = 200) {
  return String(value ?? "").trim().slice(0, max);
}

app.post("/api/leads", async (req, res) => {
  const name = clean(req.body.name, 80);
  const phone = clean(req.body.phone, 20);
  const occupation = clean(req.body.occupation, 40);
  const age = Number(req.body.age);
  const consent = req.body.consent === true;

  if (!name || !phone || !occupation || !Number.isInteger(age) || age < 18 || age > 100 || !consent) {
    return res.status(400).json({ error: "Please provide valid details and consent." });
  }

  const lead = {
    id: Date.now().toString(),
    name, age, phone, occupation,
    createdAt: new Date().toISOString()
  };

  const rows = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  rows.push(lead);
  fs.writeFileSync(dataFile, JSON.stringify(rows, null, 2));

  // Optional Telegram notification to YOUR admin chat/bot.
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    const message =
      `New Trader Trap lead\\n\\n` +
      `Name: ${name}\\nAge: ${age}\\nContact: ${phone}\\nType: ${occupation}\\n` +
      `Time: ${lead.createdAt}`;
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message })
      });
    } catch (e) {
      console.error("Telegram notification failed:", e.message);
    }
  }

  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Trader Trap running on port ${PORT}`));
