import TelegramBot from 'node-telegram-bot-api';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port} (Required for Render.com)`);
});

// Siz BotFather'dan olgan token:
const token = '8694752128:AAGsdO8xPa_TGcGNJEU_FNAdjVFU0L9qDls';

// Netlify'ga qo'yilgan Mini App havolasi:
const webAppUrl = 'https://teal-flan-946c97.netlify.app/';

// Botni ishga tushirish (polling usuli orqali doimiy xabarlarni kutadi)
const bot = new TelegramBot(token, { polling: true });

console.log("Bot ishga tushdi! Telegram orqali /start buyrug'ini yuboring...");

// /start buyrug'i kelganda ishlaydigan funksiya
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Foydalanuvchiga Web App'ni ochuvchi tugmani yuborish
  bot.sendMessage(chatId, "Assalomu alaykum! Imtihon platformasiga xush kelibsiz.\n\nTestni boshlash uchun quyidagi tugmani bosing:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "📝 Imtihonni Boshlash",
            web_app: { url: webAppUrl }
          }
        ]
      ]
    }
  });
});

// Shuningdek, klaviaturada ham qulay tugma chiqarib qo'yamiz:
bot.on('message', (msg) => {
  // Agar xabar /start bo'lmasa, har doim asosiy menyuni ko'rsatamiz
  if (msg.text !== '/start') {
    bot.sendMessage(msg.chat.id, "Platformani ochish uchun tugmadan foydalaning:", {
      reply_markup: {
        keyboard: [
          [
            {
              text: "💻 Ilovani Ochish",
              web_app: { url: webAppUrl }
            }
          ]
        ],
        resize_keyboard: true
      }
    });
  }
});
