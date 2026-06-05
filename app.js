const state = {
  data: null,
  screen: "home",
  questionIndex: 0,
  score: 0,
  selectedAnswerIndex: null,
};

const els = {
  stage: document.getElementById("stage"),
  screenImage: document.getElementById("screenImage"),
  contentLayer: document.getElementById("contentLayer"),
  hotspots: document.getElementById("hotspots"),
  fallbackPanel: document.getElementById("fallbackPanel"),
  fallbackTitle: document.getElementById("fallbackTitle"),
  fallbackText: document.getElementById("fallbackText"),
};

function shouldShowHotspotDebug() {
  const params = new URLSearchParams(window.location.search);
  const debugParam = params.get("debug");

  if (debugParam === "1" || debugParam === "true") {
    return true;
  }

  if (debugParam === "0" || debugParam === "false") {
    return false;
  }

  return (
    window.location.protocol === "file:" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}

function initialScreen() {
  const params = new URLSearchParams(window.location.search);
  const screen = params.get("screen");
  const allowedScreens = ["home", "intro", "theme", "question", "wrong", "correct"];

  if (allowedScreens.includes(screen)) {
    return screen;
  }

  return "home";
}

function loadData() {
  if (window.QUIZ_DATA) {
    return window.QUIZ_DATA;
  }

  throw new Error("Nao foi possivel carregar as perguntas. Edite questions.js.");
}

function imageFor(screen) {
  const currentQuestion = state.data.questions[state.questionIndex];
  return (
    currentQuestion?.screens?.[screen] ||
    state.data.screens?.[screen]
  );
}

function setScreen(screen) {
  state.screen = screen;
  const src = imageFor(screen);
  els.hotspots.innerHTML = "";
  els.contentLayer.innerHTML = "";
  els.contentLayer.hidden = true;
  els.fallbackPanel.hidden = true;
  els.stage.dataset.screen = screen;

  if (screen === "intro") {
    els.screenImage.hidden = true;
    renderIntro();
  } else if (screen === "theme") {
    els.screenImage.hidden = true;
    renderTheme();
  } else if (screen === "question") {
    els.screenImage.hidden = true;
    renderQuestionScreen();
  } else if (screen === "wrong") {
    els.screenImage.hidden = true;
    renderWrongScreen();
  } else if (src) {
    els.screenImage.hidden = false;
    els.screenImage.src = encodeURI(src);
    els.screenImage.alt = state.data.altText?.[screen] || state.data.title;
  } else {
    els.screenImage.hidden = true;
    els.fallbackPanel.hidden = false;
  }

  renderHotspots();
}

function renderIntro() {
  const intro = state.data.intro || {};
  els.contentLayer.hidden = false;
  els.contentLayer.innerHTML = `
    <article class="intro-page">
      ${(intro.paragraphs || [])
        .map((paragraph) => `<p>${formatText(paragraph)}</p>`)
        .join("")}
    </article>
  `;
}

function renderTheme() {
  const current = state.data.questions[state.questionIndex];
  const theme = current.theme || {};
  els.contentLayer.hidden = false;
  els.contentLayer.innerHTML = `
    <article class="theme-page">
      <img class="theme-bg" src="${escapeAttribute(theme.background || "")}" alt="" />
      ${renderScreenHeader()}
      <div class="theme-speech">${formatText(theme.speech || "")}</div>
      <img class="theme-character" src="${escapeAttribute(theme.character || "")}" alt="" />
      <section class="theme-copy">
        ${(theme.paragraphs || [])
          .map((paragraph) => `<p>${formatText(paragraph)}</p>`)
          .join("")}
      </section>      
    </article>
  `;
}

function renderQuestionScreen() {
  const current = state.data.questions[state.questionIndex];
  const questionScreen = current.questionScreen || {};
  els.contentLayer.hidden = false;
  els.contentLayer.innerHTML = `
    <article class="question-page">
      <img class="question-bg" src="${escapeAttribute(questionScreen.background || "")}" alt="" />
      ${renderScreenHeader("question-topbar")}
      <img class="question-character" src="${escapeAttribute(questionScreen.character || "")}" alt="" />
      <div class="question-speech">${formatText(questionScreen.speech || "")}</div>
      <div class="question-banner">${formatText(current.question)}</div>
      <div class="answer-card answer-card-a">
        <span>A</span>
        <p>${formatText(current.answers[0]?.text || "")}</p>
      </div>
      <div class="answer-card answer-card-b">
        <span>B</span>
        <p>${formatText(current.answers[1]?.text || "")}</p>
      </div>
      <div class="answer-card answer-card-c">
        <span>C</span>
        <p>${formatText(current.answers[2]?.text || "")}</p>
      </div>
    </article>
  `;
}

function renderWrongScreen() {
  const current = state.data.questions[state.questionIndex];
  const wrongScreen = current.wrongScreen || {};
  const selectedAnswer = current.answers[state.selectedAnswerIndex];
  const wrongAnswer =
    selectedAnswer ||
    current.answers.find((answer) => !answer.correct) ||
    current.answers[0];
  els.contentLayer.hidden = false;
  els.contentLayer.innerHTML = `
    <article class="wrong-page">
      <img class="wrong-bg" src="${escapeAttribute(wrongScreen.background || "")}" alt="" />
      ${renderScreenHeader("wrong-topbar")}
      <img class="wrong-character" src="${escapeAttribute(wrongScreen.character || "")}" alt="" />
      <div class="wrong-speech">${formatText(wrongScreen.speech || "")}</div>
      <div class="wrong-question">${formatText(current.question)}</div>
      <div class="wrong-answer">
        <span aria-hidden="true">X</span>
        <p>${formatText(wrongAnswer?.text || "")}</p>
      </div>
      <div class="back-button-visual">Volte</div>
      <div class="back-arrow" aria-hidden="true"></div>
    </article>
  `;
}

function renderScreenHeader(extraClass = "") {
  return `
    <header class="screen-topbar ${extraClass}">
      <div class="screen-logo screen-logo-left">LOGO<br />ESCOLA</div>
      <div class="screen-section">ECA DIGITAL - seção - 01</div>
      <div class="screen-logo screen-logo-right">LOGO<br />Consultoria</div>
    </header>
  `;
}

function formatText(text) {
  return escapeHtml(text)
    .replace(/\[\[white:(.*?)\]\]/g, '<span class="text-white">$1</span>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\\n|\n/g, "<br />");
}

function escapeAttribute(text) {
  return escapeHtml(text).replaceAll("`", "&#096;");
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createHotspot({ label, x, y, width, height, action, visible, className }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `hotspot ${className || ""} ${visible ? "visible" : ""}`.trim();
  button.style.left = `${x}%`;
  button.style.top = `${y}%`;
  button.style.width = `${width}%`;
  button.style.height = `${height}%`;
  button.setAttribute("aria-label", label);
  button.innerHTML = `<span class="hotspot-label">${label}</span>`;
  button.addEventListener("click", action);
  els.hotspots.appendChild(button);
  return button;
}

function renderHotspots() {
  if (state.screen === "home") {
    createHotspot({
      label: "Próxima página",
      x: 38,
      y: 90.1,
      width: 58,
      height: 7.6,
      visible: true,
      className: "next-page-hotspot",
      action: () => setScreen("intro"),
    });
    return;
  }

  if (state.screen === "intro") {
    createHotspot({
      label: "Próxima página",
      x: 38,
      y: 90.1,
      width: 58,
      height: 7.6,
      visible: true,
      className: "next-page-hotspot",
      action: () => setScreen("theme"),
    });
    return;
  }

  if (state.screen === "theme") {
    createHotspot({
      label: "Próxima página",
      x: 38,
      y: 69,
      width: 58,
      height: 7.6,
      visible: true,
      className: "next-page-hotspot",
      action: () => setScreen("question"),
    });
    return;
  }

  if (state.screen === "question") {
    renderAnswers();
    return;
  }

  if (state.screen === "wrong") {
    createHotspot({
      label: "Volte",
      x: 27,
      y: 72,
      width: 29,
      height: 8,
      action: () => setScreen("question"),
    });
    return;
  }

  if (state.screen === "correct") {
    createHotspot({
      label: "Próxima página",
      x: 39,
      y: 80,
      width: 42,
      height: 5.5,
      action: nextQuestion,
    });
  }
}

function renderAnswers() {
  const current = state.data.questions[state.questionIndex];
  current.answers.forEach((answer, index) => {
    const area =
      current.questionScreen?.answerAreas?.[index] ||
      current.answerAreas?.[index] ||
      state.data.answerAreas[index];
    const button = createHotspot({
      label: answer.text,
      ...area,
      action: () => selectAnswer(button, answer.correct, index),
      className: "answer-hotspot",
    });
    button.dataset.letter = answer.letter || String.fromCharCode(65 + index);
  });
}

function selectAnswer(button, correct, index) {
  state.selectedAnswerIndex = index;
  button.classList.add(correct ? "selected-correct" : "selected-wrong");

  if (correct) {
    state.score += 1;
    setTimeout(() => setScreen("correct"), 350);
    return;
  }

  setTimeout(() => setScreen("wrong"), 350);
}

function nextQuestion() {
  if (state.questionIndex < state.data.questions.length - 1) {
    state.questionIndex += 1;
    state.selectedAnswerIndex = null;
    setScreen("theme");
    return;
  }

  state.questionIndex = 0;
  state.score = 0;
  state.selectedAnswerIndex = null;
  setScreen("home");
}

function init() {
  state.data = loadData();
  document.title = state.data.title || "Quiz Online";
  document.body.classList.toggle("debug-hotspots", shouldShowHotspotDebug());
  els.screenImage.addEventListener("error", () => {
    els.screenImage.hidden = true;
    els.fallbackPanel.hidden = false;
    els.fallbackTitle.textContent = "Imagem nao encontrada";
    els.fallbackText.textContent = "Confira o caminho configurado em questions.js.";
  });
  setScreen(initialScreen());
}

try {
  init();
} catch (error) {
  els.screenImage.hidden = true;
  els.fallbackPanel.hidden = false;
  els.fallbackTitle.textContent = "Erro ao carregar o quiz";
  els.fallbackText.textContent = error.message;
}
