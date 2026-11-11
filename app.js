let lang = 'tg';
let grade = null;

const data = {
  tg: {
    t: "🎓 Омӯзгори Зеҳнӣ", g: "Синфро интихоб кунед (1–11):", s: "Фанро интихоб кунед:",
    ai: "🤖 Ёрдамчии Зеҳнӣ (Офлайн)", w: "Салом! Синфро интихоб кунед ё савол нависед.",
    p: "Масалан: Атом чист?", b: "Фиристодан", gw: "Синфи",
    subs: ["Математика", "Забони тоҷикӣ", "Физика", "Химия", "Биология", "Таърих"]
  },
  ru: {
    t: "🎓 Умный Учитель", g: "Выберите класс (1–11):", s: "Выберите предмет:",
    ai: "🤖 Умный Помощник (Офлайн)", w: "Привет! Выберите класс или задайте вопрос.",
    p: "Например: Что такое атом?", b: "Отправить", gw: "Класс",
    subs: ["Математика", "Русский язык", "Физика", "Химия", "Биология", "История"]
  },
  en: {
    t: "🎓 Smart Teacher", g: "Select Grade (1–11):", s: "Select Subject:",
    ai: "🤖 AI Assistant (Offline)", w: "Hello! Select a grade or ask a question.",
    p: "Example: What is an atom?", b: "Send", gw: "Grade",
    subs: ["Mathematics", "English", "Physics", "Chemistry", "Biology", "History"]
  }
};

const kb = {
  "атом": "Атом — хурдтарин заррачаи модда аст, ки аз ядро ва электронҳо иборат мебошад.",
  "пифагор": "Теоремаи Пифагор: Дар секунҷаи росткунҷа a² + b² = c² аст.",
  "об": "Формулаи химиявии об H₂O аст.",
  "atom": "An atom is the smallest unit of matter."
};

function init() {
  const gc = document.getElementById('grades-container');
  gc.innerHTML = '';
  for (let i = 1; i <= 11; i++) {
    gc.innerHTML += `<button class="grade-btn" onclick="pickGrade(${i})">${data[lang].gw} ${i}</button>`;
  }
}

function pickGrade(n) {
  grade = n;
  document.getElementById('subjects-section').style.display = 'block';
  const sc = document.getElementById('subjects-container');
  sc.innerHTML = '';
  data[lang].subs.forEach(sub => {
    sc.innerHTML += `<button class="subject-btn" onclick="msg('✅ ${data[lang].gw} ${n} — ${sub}. Савол нависед!','bot')">${sub}</button>`;
  });
}

function setLanguage(l) {
  lang = l;
  document.querySelectorAll('.lang-switch button').forEach(b => b.classList.remove('active'));
  document.getElementById('btn-' + l).classList.add('active');
  const d = data[l];
  document.getElementById('app-title').innerText = d.t;
  document.getElementById('select-grade-title').innerText = d.g;
  document.getElementById('select-subject-title').innerText = d.s;
  document.getElementById('ai-title').innerText = d.ai;
  document.getElementById('welcome-msg').innerText = d.w;
  document.getElementById('user-input').placeholder = d.p;
  document.getElementById('send-btn').innerText = d.b;
  init();
  if (grade) pickGrade(grade);
}

function msg(txt, who) {
  const box = document.getElementById('chat-messages');
  box.innerHTML += `<div class="msg ${who}">${txt}</div>`;
  box.scrollTop = box.scrollHeight;
}

function askTeacher() {
  const inp = document.getElementById('user-input');
  const q = inp.value.trim();
  if (!q) return;
  msg(q, 'user');
  inp.value = '';
  const low = q.toLowerCase();
  let ans = "Ин мавзӯъ ба зудӣ илова мешавад. Ҳоло дар бораи «Атом», «Пифагор» ё «Об» пурсед.";
  for (let k in kb) { if (low.includes(k)) ans = kb[k]; }
  setTimeout(() => msg(ans, 'bot'), 200);
}

init();
