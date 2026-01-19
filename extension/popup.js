// ⚠️ ЗАМЕНИ ЭТОТ URL НА СВОЙ ПУБЛИЧНЫЙ ИЗ RAILWAY!
const BACKEND_URL = "https://wb-ai-backend.up.railway.app/";

async function sendToAI(type, data) {
  const output = document.getElementById('output');
  output.innerText = "⏳ Анализирую...";

  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data })
    });
    const json = await res.json();
    if (json.success) {
      output.innerHTML = json.answer.replace(/\n/g, '<br>');
    } else {
      output.innerText = "❌ Ошибка: " + json.error;
    }
  } catch (err) {
    output.innerText = "⚠️ Не удалось подключиться к серверу.";
  }
}

document.getElementById('analyze').onclick = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const data = await chrome.tabs.sendMessage(tab.id, { action: "getProduct" });
  sendToAI("single", data);
};

document.getElementById('niche').onclick = () => {
  const query = prompt("Введите запрос для поиска ниши:");
  if (query) sendToAI("niche", { query });
};

document.getElementById('seo').onclick = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const data = await chrome.tabs.sendMessage(tab.id, { action: "getProduct" });
  const keywords = prompt("Ключевые слова (через запятую):", "летние, удобные");
  sendToAI("seo", { ...data, keywords });
};
