# Trader Trap Website

A responsive landing page matching the requested white + gold Trader Trap style.

## Included
- Responsive landing page
- Uploaded Trader Trap logo
- Lead form: name, age (18+), contact number, student/worker/etc.
- Consent checkbox
- Form data stored in `data/submissions.json`
- Optional Telegram admin notification via a Telegram Bot
- Customer Telegram channel CTA:
  https://t.me/+LM9T3D0eD2hiODBl

## Run locally

1. Install Node.js 18+.
2. Open this folder in a terminal.
3. Run:
   npm install
   npm start
4. Open:
   http://localhost:3000

## Telegram admin notifications

1. Create a Telegram Bot with BotFather.
2. Put the bot token in `.env` as `TELEGRAM_BOT_TOKEN`.
3. Put your private/admin chat ID in `TELEGRAM_CHAT_ID`.
4. Restart the server.

Do not publish `.env` or bot tokens.

## Production

Deploy the Node app to a host that supports persistent storage if you want `data/submissions.json` to remain available. For larger production use, replace the JSON file with a database such as PostgreSQL/Supabase.

Before collecting real customer data, publish a clear privacy notice and keep only data you actually need.
