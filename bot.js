import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Stats file path
const statsFile = './stats.json';

// Helper to load stats
const loadStats = () => {
  if (fs.existsSync(statsFile)) {
    try {
      return JSON.parse(fs.readFileSync(statsFile, 'utf8'));
    } catch (e) {
      return [];
    }
  }
  return [];
};

// Helper to save stats
const saveStats = (stats) => {
  fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
};

const token = '8694752128:AAGsdO8xPa_TGcGNJEU_FNAdjVFU0L9qDls';
const webAppUrl = 'https://teal-flan-946c97.netlify.app/';
const adminId = 930199261;

const bot = new TelegramBot(token, { polling: true });

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.post('/api/result', (req, res) => {
  const { telegramId, name, group, score, total, percentage } = req.body;

  if (telegramId) {
    // Xabarni foydalanuvchiga jo'natamiz
    bot.sendMessage(telegramId, `🎉 *Tabriklaymiz, ${name}!* \n\nSiz imtihonni yakunladingiz.\n📊 Natijangiz: ${percentage}% (${score}/${total})`, { parse_mode: 'Markdown' }).catch(err => console.log("Xabar yuborishda xato:", err));
  }

  // Statistikani saqlaymiz
  const stats = loadStats();
  stats.push({ name, group, percentage, score, total, date: new Date().toISOString() });
  saveStats(stats);

  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port} (Required for Render.com)`);
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

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

bot.onText(/\/stat/, (msg) => {
  const chatId = msg.chat.id;
  
  if (chatId !== adminId) {
    return bot.sendMessage(chatId, "Sizda bu buyruqni ishlatish huquqi yo'q!");
  }

  const stats = loadStats();
  
  if (stats.length === 0) {
    return bot.sendMessage(chatId, "Hozircha hech kim test ishlamadi.");
  }

  let text = "📊 *Umumiy Statistika:*\n\n";
  stats.forEach((s, idx) => {
    text += `${idx + 1}. *${s.name}* (${s.group}) - ${s.percentage}% (${s.score}/${s.total})\n`;
  });

  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
});

bot.on('message', (msg) => {
  if (msg.text !== '/start' && msg.text !== '/stat') {
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
