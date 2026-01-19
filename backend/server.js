const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.post('/analyze', async (req, res) => {
  const { type, data } = req.body;

  let prompt = "";
  switch (type) {
    case "single":
      prompt = `Ты — эксперт по Wildberries. Проанализируй товар:\nНазвание: ${data.title}\nЦена: ${data.price} ₽\nОтзывы: ${data.reviews}, Рейтинг: ${data.rating}★\nКатегория: ${data.category}\n\nОцени цену, название, риски и шансы. Ответ кратко, с эмодзи, без снежинок.`;
      break;
    case "compare":
      prompt = `Сравни мой товар (${data.my.title}, ${data.my.price}₽, ${data.my.rating}★) с конкурентами:\n${data.competitors.map(c => `- ${c.title}, ${c.price}₽, ${c.rating}★`).join('\n')}\n\nГде я сильнее? Что улучшить?`;
      break;
    case "niche":
      prompt = `Проанализируй нишу "${data.query}" на Wildberries. Оцени средний чек, конкуренцию, рост новых товаров. Дай рекомендацию: входить или нет?`;
      break;
    case "seo":
      prompt = `Напиши SEO-описание для Wildberries (до 1500 символов):\nТовар: ${data.title}\nХарактеристики: ${data.specs || 'не указаны'}\nКлючевые слова: ${data.keywords || 'не указаны'}\nСтиль: дружелюбный, убедительный, без воды.`;
      break;
    default:
      return res.status(400).json({ error: "Неизвестный тип" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://wb-analyzer.local",
        "X-Title": "WB AI Analyst",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const result = await response.json();
    if (!result.choices) throw new Error(JSON.stringify(result));
    
    const answer = result.choices[0].message.content.trim();
    res.json({ success: true, answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка ИИ: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Сервер запущен на порту ${PORT}`));
