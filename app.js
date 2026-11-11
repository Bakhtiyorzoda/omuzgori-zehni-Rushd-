let currentLang = 'tg';
let selectedGrade = null;

const translations = {
  tg: {
    title: "🎓 Омӯзгори Зеҳнӣ",
    selectGrade: "Синфро интихоб кунед (1–11):",
    selectSubject: "Фанро интихоб кунед:",
    aiTitle: "🤖 Ёрдамчии Зеҳнӣ (Офлайн)",
    welcome: "Салом! Ман Омӯзгори зеҳнии шумо. Синф ва фанро интихоб кунед ё савол нависед.",
    placeholder: "Масалан: Атом чист?",
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
    placeholder: "Например: Что такое атом?",
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
    placeholder: "Example: What is an atom?",
    send: "Send",
    gradeWord: "Grade",
    subjects: ["Mathematics", "English", "Physics", "Chemistry", "Biology", "History", "Computer Science"]
  }
};

const offlineKnowledge = {
  "атом": "Атом — хурдтарин заррачаи модда аст, ки хосиятҳои химиявии онро нигоҳ медорад. Он аз ядро (протонҳо ва нейтронҳо) ва электронҳо иборат аст.",
  "пифагор": "Теоремаи Пифагор: Дар секунҷаи росткунҷа квадрати гипотенуза ба суммаи квадратҳои катетҳо баробар аст (a² + b² = c²).",
  "пифагора": "Теорема Пифагора: В прямоугольном треугольнике квадрат гипотенузы равен сумме квадратов катетов (a² + b² = c²).",
  "pythagorean": "Pythagorean theorem: In a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides (a² + b² = c²).",
  "об": "Формулаи химиявии об H₂O аст. Он аз ду атоми гидроген ва як атоми оксиген иборат мебошад.",
  "atom": "An atom is the smallest unit of matter that retains the properties of an element. It consists of a nucleus (protons and neutrons) and electrons."
};

function renderGrades() {
  const container = document.getElementById('grades-container');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 1; i <= 11; i++) {
    const btn = document.createElement('button');
    btn.className = 'grade-btn';
    btn.innerText = translations[currentLang].gradeWord + ' ' + i;
    btn.onclick = function() { selectGrade(i); };
    container.appendChild(btn);
  }
}

function selectGrade(grade) {
  selectedGrade = grade;
  const sec = document.getElementById('subjects-section');
  const subContainer = document.getElementById('subjects-container');
  sec.style.display = 'block';
  subContainer.innerHTML = '';
  translations[currentLang].subjects.forEach(function(sub) {
    const btn = document.createElement('button');
    btn.className = 'subject-btn';
    btn.innerText = sub;
    btn.onclick = function() {
      addMessage('✅ ' + translations[currentLang].gradeWord + ' ' + grade + ' — ' + sub + '. Саволи худро нависед!', 'bot');
    };
    subContainer.appendChild(btn);
  });
}

function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-switch button').forEach(function(b) { b.classList.remove('active'); });
  document.getElementById('btn-' + lang).classList.add('active');
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
  div.className = 'msg ' + sender;
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
    if (currentLang === 'tg') {
      reply = "Ин мавзӯъ ба зудӣ илова мешавад. Ҳоло метавонед дар бораи «Атом», «Пифагор» ё «Об» пурсед.";
    } else if (currentLang === 'ru') {
      reply = "Эта тема скоро будет добавлена. Сейчас спросите про «Атом» или «Теорему Пифагора».";
    } else {
      reply = "This topic will be added soon. Try asking about 'Atom' or 'Pythagorean theorem'.";
    }
  }
  setTimeout(function() { addMessage(reply, 'bot'); }, 250);
}

document.addEventListener('DOMContentLoaded', renderGrades);
renderGrades();
