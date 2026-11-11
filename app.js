let L = 'tg', G = null;
const GEMINI_KEY = "КАЛИДИ_GEMINI"; // Калиди ройгонро аз Google AI Studio инҷо гузоред

const T = {
  tg: { gt: "Синфро интихоб кунед (1–11):", st: "Фанро интихоб кунед:", wm: "Салом! Савол ё масъалаи худро нависед.", sb: "Фиристодан", gw: "Синфи", s: ["Математика", "Забони тоҷикӣ", "Физика", "Химия", "Биология", "Таърих"] },
  ru: { gt: "Выберите класс (1–11):", st: "Выберите предмет:", wm: "Привет! Напишите вопрос или задачу.", sb: "Отправить", gw: "Класс", s: ["Математика", "Русский язык", "Физика", "Химия", "Биология", "История"] },
  en: { gt: "Select Grade (1–11):", st: "Select Subject:", wm: "Hello! Type your question or math problem.", sb: "Send", gw: "Grade", s: ["Math", "Language", "Physics", "Chemistry", "Biology", "History"] }
};

let lessons = [];
let DB = JSON.parse(localStorage.getItem('oz_verified_db') || '{}');

// Боргирии мавзӯъҳои санҷидашудаи китобҳои дарсӣ
fetch('lessons.json').then(r => r.json()).then(d => { lessons = d; }).catch(() => {});

function draw() {
  let h = '';
  for (let i = 1; i <= 11; i++) h += `<button class="btn ${G==i?'active':''}" onclick="pickG(${i})">${T[L].gw} ${i}</button>`;
  document.getElementById('grades').innerHTML = h;
}

function pickG(n) {
  G = n; draw();
  document.getElementById('subCard').style.display = 'block';
  document.getElementById('subs').innerHTML = T[L].s.map(x => `<button class="btn" onclick="addM('✅ ${T[L].gw} ${n} — ${x}','bot')">${x}</button>`).join('');
}

function setL(l) {
  L = l; ['tg','ru','en'].forEach(x => document.getElementById(x).classList.toggle('active', x==l));
  ['gt','st','wm','sb'].forEach(k => document.getElementById(k).innerText = T[l][k]);
  draw(); if (G) pickG(G);
}

function addM(t, w) {
  const c = document.getElementById('chat');
  c.innerHTML += `<div class="msg ${w}">${t}</div>`; c.scrollTop = c.scrollHeight;
}

async function ask() {
  const i = document.getElementById('inp'), q = i.value.trim();
  if (!q) return; addM(q, 'user'); i.value = '';
  const low = q.toLowerCase();

  // 1. Аввал аз китобҳои дарсии санҷидашуда (lessons.json) меҷӯяд (100% бе хато ва офлайн)
  for (let item of lessons) {
    if (item.keywords.some(k => low.includes(k))) {
      return addM("📚 [Китоби дарсӣ]: " + item[L], 'bot');
    }
  }

  // 2. Аз хотираи сабтшудаи офлайн месанҷад
  if (DB[low]) return addM(DB[low], 'bot');

  // 3. Агар интернет бошад, ба Зеҳни Сунъии дақиқ (Gemini) муроҷиат мекунад
  if (navigator.onLine && GEMINI_KEY !== "КАЛИДИ_GEMINI") {
    addM("⏳ Омӯзгор фикр мекунад...", 'bot');
    try {
      const langName = L === 'tg' ? 'тоҷикӣ' : L === 'ru' ? 'русӣ' : 'англисӣ';
      const systemRule = `Ту омӯзгори ботаҷрибаи мактаби миёна ҳастӣ. Ба забони ${langName} барои хонандаи ${G ? 'синфи ' + G : 'мактаб'} танҳо маълумоти дақиқ, илмӣ ва бе хато деҳ. Агар масъала бошад, қадам ба қадам ҳал кун. Савол: ${q}`;
      const res = await fetch(`https://googleapis.com{GEMINI_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: systemRule }] }] })
      });
      const json = await res.json();
      const box = document.getElementById('chat');
      box.removeChild(box.lastChild);
      const reply = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) {
        DB[low] = reply;
        localStorage.setItem('oz_verified_db', JSON.stringify(DB));
        return addM(reply, 'bot');
      }
    } catch (e) {}
  }

  addM("📴 Дар пойгоҳи офлайн ёфт нашуд. Барои ҷавоби дақиқ ба ҳама саволҳо интернетро фаъол кунед.", 'bot');
}

draw();
