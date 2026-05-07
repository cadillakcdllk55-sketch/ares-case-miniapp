require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");

const app = express();

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true
});

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(
    chatId,

    `
🎁 Welcome to Ares Case

Open the mini app below and start opening cases.
    `,

    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🎰 OPEN CASES",
              web_app: {
                url: process.env.WEB_APP_URL
              }
            }
          ],

          [
            {
              text: "👤 Profile",
              callback_data: "profile"
            },

            {
              text: "🎁 Daily Reward",
              callback_data: "daily"
            }
          ],

          [
            {
              text: "💰 Deposit",
              callback_data: "deposit"
            },

            {
              text: "🏧 Withdraw",
              callback_data: "withdraw"
            }
          ]
        ]
      }
    }
  );
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;

  if (query.data === "profile") {
    bot.sendMessage(
      chatId,

      `
👤 Profile

Balance: 35 ⭐
Tickets: 2 🎟️
Level: 3
      `
    );
  }

  if (query.data === "daily") {
    bot.sendMessage(
      chatId,

      `
🎁 Daily Reward

You received:
+5 ⭐
      `
    );
  }

  if (query.data === "deposit") {
    bot.sendMessage(
      chatId,

      `
💰 Deposit system will be added.
      `
    );
  }

  if (query.data === "withdraw") {
    bot.sendMessage(
      chatId,

      `
🏧 Withdraw system will be added.
      `
    );
  }

  bot.answerCallbackQuery(query.id);
});

app.listen(PORT, () => {
  console.log(`
🚀 Ares Mini App Running
🌐 Port: ${PORT}
  `);
});

console.log("🤖 Telegram Bot Active");