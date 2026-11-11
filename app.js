javascript
let currentLang = 'tg';
let selectedGrade = null;

const translations = {
  tg: {
    title: "🎓 Омӯзгори Зеҳнӣ",
    selectGrade: "Синфро интихоб кунед (1–11):",
    selectSubject: "Фанро интихоб кунед:",
    aiTitle: "🤖 Ёрдамчии Зеҳнӣ (Офлайн)",
    welcome: "Салом! Ман Омӯзгори зеҳнии шумо. Синф ва фанро интихоб кунед ё савол нависед.",
    placeholder: "Масалан: Теоремаи Пифагор чист?",
    send: "Фиристодан",
    gradeWord: "Синфи",
    subjects: ["Математика", "Забони тоҷикӣ", "Физика", "Химия", "Биология", "Таърих", "Забони англисӣ"]
  },
  ru: {
    title: "🎓 Умный Учитель",
    selectGrade: "Выберите класс (1–11):",
    selectSubject: "Выберите предмет:",
    aiTitle: "🤖 Умный Помощник (Офлайн)",
    welcome: "Привет! Я ваш умный учитель. Выберите класс и предмет или задайте вопрос.",
    placeholder: "Например: Что такое теорема Пифагора?",
    send: "Отправить",
    gradeWord: "Класс",
    subjects: ["Математика", "Русский язык", "Физика", "Химия", "Биология", "История", "Английский язык"]
  },
  en: {
    title: "🎓 Smart Teacher",
    selectGrade: "Select Grade (1–11):",
    selectSubject: "Select Subject:",
    aiTitle: "🤖 AI Assistant (Offline)",
    welcome: "Hello! I am your Smart Teacher. Select a grade and subject or ask a question.",
    placeholder: "Example: What is the Pythagorean theorem?",
    send: "Send",
    gradeWord: "Grade",
    subjects: ["Mathematics", "English", "Physics", "Chemistry", "Biology", "History", "Computer Science"]
  }
};

// Пойгоҳи дониши офлайн (намуна барои оғоз)
const offlineKnowledge = {
  "пифагор": "Теоремаи Пифагор: Дар секунҷаи росткунҷа квадрати гипотенуза ба суммаи квадратҳои катетҳо баробар аст (a² + b² = c²).",
  "пифагора": "Теорема Пифагора: В прямоугольном треугольнике квадрат гипотенузы равен сумме квадратов катетов (a² + b² = c²).",
  "pythagorean": "Pythagorean theorem: In a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides (a² + b² = c²).",
  "об": "Формулаи химиявии об H₂O аст. Он аз ду атоми гидроген ва як атоми оксиген иборат мебошад."
};

function renderGrades() {
  const container = document.getElementById('grades-container');
  container.innerHTML = '';
  for (let i = 1; i <= 11; i++) {
    const btn = document.createElement('button');
    btn.className = 'grade-btn';
    btn.innerText = `${translations[currentLang].gradeWord} ${i}`;
    btn.onclick = () => selectGrade(i);
    container.appendChild(btn);
  }
}

function selectGrade(grade) {
  selectedGrade = grade;
  const sec = document.getElementById('subjects-section');
  const subContainer = document.getElementById('subjects-container');
  sec.style.display = 'block';
  subContainer.innerHTML = '';
  translations[currentLang].subjects.forEach(sub => {
    const btn = document.createElement('button');
    btn.className = 'subject-btn';
    btn.innerText = sub;
    btn.onclick = () => addMessage(`✅ ${translations[currentLang].gradeWord} ${grade} — ${sub}. Мавзӯи худро нависед!`, 'bot');
    subContainer.appendChild(btn);
  });
}

function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-switch button').forEach(b => b.classList.remove('active'));
  document.getElementById(`btn-${lang}`).classList.add('active');
  const t = translations[lang];
  document.getElementById('app-title').innerText = t.title;
  document.getElementById('select-grade-title').innerText = t.selectGrade;
  document.getElementById('select-subject-title').innerText = t.selectSubject;
  document.getElementById('ai-title').innerText = t.aiTitle;
  document.getElementById('welcome-msg').innerText = t.welcome;
  document.getElementById('user-input').placeholder = t.placeholder;
  document.getElementById('send-btn').innerText = t.send;
  renderGrades();
  if (selectedGrade) selectGrade(selectedGrade);
}

function addMessage(text, sender) {
  const box = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `msg ${sender}`;
  div.innerText = text;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function askTeacher() {
  const input = document.getElementById('user-input');
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  input.value = '';

  const lower = text.toLowerCase();
  let reply = null;
  for (let key in offlineKnowledge) {
    if (lower.includes(key)) {
      reply = offlineKnowledge[key];
      break;
    }
  }
  if (!reply) {
    reply = currentLang === 'tg' 
      ? "Ин мавзӯъ дар пойгоҳи офлайн сабт мешавад. Ҳоло метавонед дар бораи «Теоремаи Пифагор» ё «Об» пурсед."
      : currentLang === 'ru'
      ? "Эта тема будет добавлена в офлайн-базу. Сейчас попробуйте спросить про «Теорему Пифагора»."
      : "This topic will be added to the offline database. Try asking about the 'Pythagorean theorem'.";
  }
  setTimeout(() => addMessage(reply, 'bot'), 300);
}

renderGrades();
