# 💬 Telegram Membership Bot with M-Pesa Integration

A powerful Telegram bot that manages paid access to private channels and groups using **M-Pesa Daraja API** with **STK Push**.

> 🔐 Automate memberships, accept payments via M-Pesa, and auto-remove expired users.

3---

## ⚙️ Features

- 💳 Display premium membership plans
- 📱 Collect user's M-Pesa number
- ⚡ Send STK Push request via M-Pesa Daraja API
- ✅ Confirm payment and send a private join link
- ⏳ Track subscription duration
- 🚪 Auto-remove users when their membership expires

---
## Environment Variables
TELEGRAM_BOT_TOKEN=xxxxxx

BOT_ADMIN_PASSWORD=secret_pass

# M-Pesa
MPESA_TYPE=paybill_or_till

MPESA_CONSUMER_KEY=xxx

MPESA_CONSUMER_SECRET=xxx

MPESA_PASSKEY=xxx

MPESA_SHORTCODE=xxxxx

MPESA_STORE_NUMBER=xxxxx

MPESA_SHORTCODE_TYPE=paybill_or_till

# Stars Payments (if required)
TELEGRAM_PAYMENT_PROVIDER_TOKEN=xxx


## 📦 Live Deployment

Deploy instantly to your favorite platform:

<p align="center">
  <a href="https://console.koyeb.com" target="_blank">
    <img src="https://img.shields.io/badge/Deploy%20to-Koyeb-blue?logo=koyeb&style=for-the-badge" />
  </a>
  <a href="https://replit.com/import/github/kariuki727/tmt-premium-bot" target="_blank">
    <img src="https://img.shields.io/badge/Deploy%20to-Replit-purple?logo=replit&style=for-the-badge" />
  </a>
  <a href="https://render.com/deploy" target="_blank">
    <img src="https://img.shields.io/badge/Deploy%20to-Render-darkblue?logo=render&style=for-the-badge" />
  </a>
  <a href="https://heroku.com/deploy?template=https://github.com/kariuki727/tmt-premium-bot" target="_blank">
    <img src="https://img.shields.io/badge/Deploy%20to-Heroku-430098?logo=heroku&style=for-the-badge" />
  </a>
</p>

---

## 🛠️ Tech Stack

- Python 3.x
- Telegram Bot API (`python-telegram-bot`)
- M-Pesa Daraja API (STK Push)
- Flask (Webhook & payment confirmation)
- SQLite (can be swapped for PostgreSQL/MySQL)
- APScheduler (for scheduled expiry checks)

---

#🚀 Sponsored by [Briceka Enterprise](https://briceka.com/donate)

