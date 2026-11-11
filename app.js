let lang = 'tg', grade = null, qIndex = 0;

const data = {
  tg: { t: "🎓 Омӯзгори Зеҳнӣ", g: "Синфро интихоб кунед (1–11):", s: "Фанро интихоб кунед:", tabChat: "🤖 Омӯзгори Зеҳнӣ", tabQuiz: "📝 Тестҳо", w: "Салом! Дилхоҳ саволро нависед (ҳам бо интернет ва ҳам бе интернет кор мекунад).", p: "Масалан: Қувва чист?", b: "Фиристодан", gw: "Синфи", next: "Саволи навбатӣ ➔", subs: ["Математика", "Забони тоҷикӣ", "Физика", "Химия", "Биология", "Таърих"] },
  ru: { t: "🎓 Умный Учитель", g: "Выберите класс (1–11):", s: "Выберите предмет:", tabChat: "🤖 Умный Учитель", tabQuiz: "📝 Тесты", w: "Привет! Задайте любой вопрос (работает онлайн и офлайн).", p: "Например: Что такое сила?", b: "Отправить", gw: "Класс", next: "Следующий вопрос ➔", subs: ["Математика", "Русский язык", "Физика", "Химия", "Биология", "История"] },
  en: { t: "🎓 Smart Teacher", g: "Select Grade (1–11):", s: "Select Subject:", tabChat: "🤖 Smart Teacher", tabQuiz: "📝 Quizzes", w: "Hello! Ask any question (works both online and offline).", p: "Example: What is force?", b: "Send", gw: "Grade", next: "Next Question ➔", subs: ["Mathematics", "English", "Physics", "Chemistry", "Biology", "History"] }
};

const builtInKB = {
  "қувва": "Қувва — бузургии физикии векторӣ буда, ченаки таъсири мутақобилаи ҷисмҳо ба ҳамдигар мебошад. Воҳиди ченаки он Нютон (Н) аст (F = m · a).",
  "сила": "Сила — физическая векторная величина, являющаяся мерой воздействия на данное тело со стороны других тел (F = m · a). Измеряется в Ньютонах (Н).",
  "force": "Force is an influence that can change the motion of an object (F = m · a). Measured in Newtons (N).",
  "паранд": "Парандагон — ҳайвоноти муҳрадори гармхуне мебошанд, ки баданашон бо пар пӯшида шудааст, бол ва дили чорхонагӣ доранд.",
  "атом": "Атом — хурдтарин заррачаи модда аст, ки аз ядро (протонҳо ва нейтронҳо) ва электронҳо иборат мебошад.",
  "пифагор": "Теоремаи Пифагор: Дар секунҷаи росткунҷа квадрати гипотенуза ба суммаи квадратҳои катетҳо баробар аст (a² + b² = c²).",
  "об": "Формулаи химиявии об H₂O аст. Дар 0°C ях мекунад ва дар 100°C меҷӯшад.",
  "фотосинтез": "Фотосинтез — раванди дар баргҳои сабз бо ёрии нури офтоб аз гази карбонат ва об ҳосил шудани моддаҳои органикӣ ва оксиген аст.",
  "сомониён": "Давлати Сомониён (875–999) — аввалин давлати мутамаркази тоҷикон бо пойтахташ Бухоро ва амири бузургаш Исмоили Сомонӣ.",
  "сино": "Абӯалӣ ибни Сино (980–1037) — олим, файласуф ва табиби бузурги тоҷик, муаллифи китобҳои «Ал-Қонун фит-тиб» ва «Донишнома»."
};

let savedKB = JSON.parse(localStorage.getItem('omuzgor_kb') || '{}');

const quizzes = [
  { q: "1. Воҳиди ченаки қувва дар физика чист?", opts: ["Ҷоул (Ҷ)", "Нютон (Н)", "Ватт (Вт)"], ans: 1 },
  { q: "2. Формулаи химиявии об кадом аст?", opts: ["CO₂", "H₂O", "O₂"], ans: 1 },
  { q: "3. Дили парандагон аз чанд хона иборат аст?", opts: ["2 хона", "3 хона", "4 хона"], ans: 2 },
  { q: "4. Пойтахти давлати Сомониён кадом шаҳр буд?", opts: ["Самарқанд", "Бухоро", "Балх"], ans: 1 }
];

function init() {
  const gc = document.getElementById('grades-container');
  gc.innerHTML = '';
  for (let i = 1; i <= 11; i++) {
    gc.innerHTML += `<button class="${grade === i ? 'grade-btn selected' : 'grade-btn'}" onclick="pickGrade(${i})">${data[lang].gw} ${i}</button>`;
  }
}

function pickGrade(n) {
  grade = n; init();
  document.getElementById('subjects-section').style.display = 'block';
  const sc = document.getElementById('subjects-container');
  sc.innerHTML = '';
  data[lang].subs.forEach(sub => { sc.innerHTML += `<button class="subject-btn" onclick="pickSubject(this, '${sub}')">${sub}</button>`; });
}

function pickSubject(btn, sub) {
  document.querySelectorAll('.subject-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected'); switchTab('chat');
  msg(`✅ ${data[lang].gw} ${grade} — ${sub}. Савол нависед!`, 'bot');
}

function switchTab(tab) {
  document.getElementById('tab-chat').classList.toggle('active', tab === 'chat');
  document.getElementById('tab-quiz').classList.toggle('active', tab === 'quiz');
  document.getElementById('chat-section').style.display = tab === 'chat' ? 'block' : 'none';
  document.getElementById('quiz-section').style.display = tab === 'quiz' ? 'block' : 'none';
  if (tab === 'quiz') loadQuestion();
}

function loadQuestion() {
  const item = quizzes[qIndex % quizzes.length];
  document.getElementById('quiz-q').innerText = item.q;
  document.getElementById('quiz-feedback').innerText = '';
  const box = document.getElementById('quiz-options'); box.innerHTML = '';
  item.opts.forEach((opt, idx) => { box.innerHTML += `<button class="quiz-opt" onclick="checkAnswer(this, ${idx}, ${item.ans})">${opt}</button>`; });
}

function checkAnswer(btn, idx, correct) {
  const btns = document.querySelectorAll('.quiz-opt'); btns.forEach(b => b.disabled = true);
  if (idx === correct) { btn.classList.add('correct'); document.getElementById('quiz-feedback').innerText = "✅ Офарин! Ҷавоб дуруст аст."; }
  else { btn.classList.add('wrong'); btns[correct].classList.add('correct'); document.getElementById('quiz-feedback').innerText = "❌ Нодуруст."; }
}

function nextQuestion() { qIndex++; loadQuestion(); }

function setLanguage(l) {
  lang = l; document.querySelectorAll('.lang-switch button').forEach(b => b.classList.remove('active'));
  document.getElementById('btn-' + l).classList.add('active');
  const d = data[l];
  document.getElementById('app-title').innerText = d.t; document.getElementById('select-grade-title').innerText = d.g;
  document.getElementById('select-subject-title').innerText = d.s; document.getElementById('tab-chat').innerText = d.tabChat;
  document.getElementById('tab-quiz').innerText = d.tabQuiz; document.getElementById('welcome-msg').innerText = d.w;
  document.getElementById('user-input').placeholder = d.p; document.getElementById('send-btn').innerText = d.b;
  document.getElementById('next-q-btn').innerText = d.next;
  init(); if (grade) pickGrade(grade);
}

function msg(txt, who) {
  const box = document.getElementById('chat-messages');
  box.innerHTML += `<div class="msg ${who}">${txt}</div>`; box.scrollTop = box.scrollHeight;
}

function searchLocal(query) {
  const low = query.toLowerCase().replace(/[?.,!]/g, '');
  const words = low.split(/\s+/);
  for (let k in savedKB) { if (low.includes(k) || words.some(w => w.length > 3 && k.includes(w))) return savedKB[k]; }
  for (let k in builtInKB) { if (low.includes(k) || words.some(w => w.length > 3 && k.includes(w))) return builtInKB[k]; }
  return null;
}

async function searchOnline(query) {
  const clean = query.replace(/(чист|кист|дар бораи|что такое|кто такой|what is|about|\?)/gi, '').trim();
  const wikiLang = lang === 'tg' ? 'tg' : lang === 'ru' ? 'ru' : 'en';
  try {
    const searchUrl = `https://${wikiLang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(clean)}&format=json&origin=*`;
    const sRes = await fetch(searchUrl);
    const sData = await sRes.json();
    if (sData.query && sData.query.search && sData.query.search.length > 0) {
      const title = sData.query.search[0].title;
      const sumUrl = `https://${wikiLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
      const sumRes = await fetch(sumUrl);
      const sumData = await sumRes.json();
      if (sumData.extract) {
        savedKB[clean.toLowerCase()] = sumData.extract;
        localStorage.setItem('omuzgor_kb', JSON.stringify(savedKB));
        return sumData.extract;
      }
    }
  } catch (e) {}
  return null;
}

async function askTeacher() {
  const inp = document.getElementById('user-input'), q = inp.value.trim();
  if (!q) return;
  msg(q, 'user'); inp.value = '';

  const localAns = searchLocal(q);
  if (localAns) { setTimeout(() => msg(localAns, 'bot'), 150); return; }

  if (navigator.onLine) {
    msg("⏳ Дар ҳоли ҷустуҷӯ...", 'bot');
    const onlineAns = await searchOnline(q);
    const box = document.getElementById('chat-messages');
    box.removeChild(box.lastChild);
    if (onlineAns) {
      msg(onlineAns + "\n\n💾 (Барои кори бе интернет сабт шуд!)", 'bot');
      return;
    }
  }

  msg("📴 Ин мавзӯъ дар хотираи офлайн нест. Бо интернет пурсед — барнома онро меёбад ва барои бе интернет сабт мекунад!", 'bot');
}

init();
