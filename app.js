const state = {
  data: null,
  screen: "home",
  questionIndex: 0,
  score: 0,
  selectedAnswerIndex: null,
  activeTrophy: null,
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

const DEFAULT_NEXT_BUTTON = {
  x: 38,
  y: 90.1,
  width: 58,
  height: 7.6,
  visible: true,
  className: "next-page-hotspot",
};

const SCREEN_RENDERERS = {
  intro: renderIntro,
  theme: renderTheme,
  question: renderQuestionScreen,
  wrong: renderWrongScreen,
  correct: renderCorrectScreen,
  stickerFull: renderStickerFullScreen,
  trophy: renderTrophyScreen,
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
  const allowedScreens = [
    "home",
    "intro",
    "theme",
    "question",
    "wrong",
    "correct",
    "stickerFull",
    "trophy",
  ];

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

function currentQuestion() {
  return state.data.questions[state.questionIndex];
}

function imageFor(screen) {
  const current = currentQuestion();
  return (
    current?.screens?.[screen] ||
    state.data.screens?.[screen]
  );
}

function setScreen(screen) {
  state.screen = screen;
  const src = imageFor(screen);
  const renderer = SCREEN_RENDERERS[screen];
  els.hotspots.innerHTML = "";
  els.contentLayer.innerHTML = "";
  els.contentLayer.hidden = true;
  els.fallbackPanel.hidden = true;
  els.stage.dataset.screen = screen;

  if (renderer) {
    els.screenImage.hidden = true;
    renderer();
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
      ${renderParagraphs(intro.paragraphs)}
    </article>
  `;
}

function renderTheme() {
  const current = currentQuestion();
  const theme = current.theme || {};
  els.contentLayer.hidden = false;
  els.contentLayer.innerHTML = `
    <article class="theme-page">
      <img class="theme-bg" src="${escapeAttribute(theme.background || "")}" alt="" />
      ${renderScreenHeader()}
      <div class="theme-speech"${styleAttribute(theme.speechStyle)}>${formatText(theme.speech || "")}</div>
      ${renderImage("theme-character", theme.character, theme.characterStyle)}
      <section class="theme-copy"${styleAttribute(theme.copyStyle)}>
        ${renderParagraphs(theme.paragraphs)}
      </section>
    </article>
  `;
}

function renderQuestionScreen() {
  const current = currentQuestion();
  const questionScreen = current.questionScreen || {};
  els.contentLayer.hidden = false;
  els.contentLayer.innerHTML = `
    <article class="question-page">
      <img class="question-bg" src="${escapeAttribute(questionScreen.background || "")}" alt="" />
      ${renderScreenHeader("question-topbar")}
      ${renderImage("question-character", questionScreen.character, questionScreen.characterStyle)}
      <div class="question-speech"${styleAttribute(questionScreen.speechStyle)}>${formatText(questionScreen.speech || "")}</div>
      <div class="question-banner"${styleAttribute(questionScreen.bannerStyle)}>${formatText(current.question)}</div>
      ${renderAnswerCards(current)}
    </article>
  `;
}

function renderWrongScreen() {
  const current = currentQuestion();
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
      ${renderImage("wrong-character", wrongScreen.character, wrongScreen.characterStyle)}
      <div class="wrong-speech"${styleAttribute(wrongScreen.speechStyle)}>${formatText(wrongScreen.speech || "")}</div>
      <div class="wrong-question"${styleAttribute(wrongScreen.questionStyle)}>${formatText(current.question)}</div>
      <div class="wrong-answer"${styleAttribute(wrongScreen.answerStyle)}>
        <span aria-hidden="true">X</span>
        <p>${formatText(wrongAnswer?.text || "")}</p>
      </div>
      <div class="back-button-visual"${styleAttribute(wrongScreen.backButtonStyle)}>Volte</div>
      <div class="back-arrow" aria-hidden="true"${styleAttribute(wrongScreen.backArrowStyle)}></div>
    </article>
  `;
}

function renderCorrectScreen() {
  const current = currentQuestion();
  const correctScreen = current.correctScreen || {};
  els.contentLayer.hidden = false;
  els.contentLayer.innerHTML = `
    <article class="correct-page">
      <img class="correct-bg" src="${escapeAttribute(correctScreen.background || "")}" alt="" />
      <div class="correct-logos">
        <div class="screen-logo screen-logo-left">LOGO<br />ESCOLA</div>
        <div class="screen-logo screen-logo-right">LOGO<br />Consultoria</div>
      </div>
      ${renderImage("sticker-header", correctScreen.header, correctScreen.headerStyle)}
      <div class="sticker-title"${styleAttribute(correctScreen.titleStyle)}>${formatText(correctScreen.title || "")}</div>
      ${renderImage("sticker-card", correctScreen.sticker, correctScreen.stickerStyle)}
    </article>
  `;
}

function renderStickerFullScreen() {
  const current = currentQuestion();
  const stickerFull = current.stickerFullScreen || {};
  els.contentLayer.hidden = false;
  els.contentLayer.innerHTML = `
    <article class="sticker-full-page">
      <img class="sticker-full-bg" src="${escapeAttribute(stickerFull.background || "")}" alt="" />
      ${renderImage("sticker-full-card", stickerFull.sticker, stickerFull.stickerStyle)}
    </article>
  `;
}

function renderTrophyScreen() {
  const trophy = state.activeTrophy || {};
  els.contentLayer.hidden = false;
  els.contentLayer.innerHTML = `
    <article class="trophy-page">
      ${renderImage("trophy-bg", trophy.background, trophy.backgroundStyle)}
      ${renderImage("trophy-image", trophy.image, trophy.imageStyle)}
      <div class="trophy-title"${styleAttribute(trophy.titleStyle)}>${formatText(trophy.title || "")}</div>
      <div class="trophy-text"${styleAttribute(trophy.textStyle)}>${formatText(trophy.text || "")}</div>
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

function renderImage(className, src, style = {}) {
  if (!src) return "";
  return `<img class="${className}" src="${escapeAttribute(src)}" alt=""${styleAttribute(style)} />`;
}

function renderParagraphs(paragraphs = []) {
  return paragraphs.map((paragraph) => `<p>${formatText(paragraph)}</p>`).join("");
}

function renderAnswerCards(question) {
  const cards = question.questionScreen?.answerCards || [];

  return question.answers
    .map((answer, index) => {
      const letter = answer.letter || String.fromCharCode(65 + index);
      const style = cards[index] || {};

      return `
        <div class="answer-card"${styleAttribute(style)}>
          <span>${formatText(letter)}</span>
          <p>${formatText(answer.text || "")}</p>
        </div>
      `;
    })
    .join("");
}

function styleAttribute(style = {}) {
  const rules = Object.entries(style)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([property, value]) => {
      const cssProperty = property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      const cssValue = typeof value === "number" ? `${value}px` : String(value);
      return `${cssProperty}: ${escapeAttribute(cssValue)}`;
    });

  return rules.length ? ` style="${rules.join("; ")}"` : "";
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
      ...DEFAULT_NEXT_BUTTON,
      y: 69,
      ...(currentQuestion().theme?.nextButton || {}),
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
      ...(currentQuestion().wrongScreen?.backHotspot || { x: 27, y: 72, width: 29, height: 8 }),
      action: () => setScreen("question"),
    });
    return;
  }

  if (state.screen === "correct") {
    createHotspot({
      label: "Próxima página",
      ...DEFAULT_NEXT_BUTTON,
      y: 79.8,
      ...(currentQuestion().correctScreen?.nextButton || {}),
      action: () => setScreen("stickerFull"),
    });
    return;
  }

  if (state.screen === "stickerFull") {
    createHotspot({
      label: "Próxima página",
      ...DEFAULT_NEXT_BUTTON,
      ...(currentQuestion().stickerFullScreen?.nextButton || {}),
      action: completeQuestion,
    });
    return;
  }

  if (state.screen === "trophy") {
    createHotspot({
      label: "Próxima página",
      ...DEFAULT_NEXT_BUTTON,
      ...(state.activeTrophy?.nextButton || {}),
      action: nextQuestion,
    });
  }
}

function renderAnswers() {
  const current = currentQuestion();
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

function completeQuestion() {
  const completedQuestion = state.questionIndex + 1;
  const trophy = trophyForCompletedQuestion(completedQuestion);

  if (trophy) {
    state.activeTrophy = trophy;
    setScreen("trophy");
    return;
  }

  nextQuestion();
}

function trophyForCompletedQuestion(completedQuestion) {
  return (state.data.trophies || []).find(
    (trophy) => trophy.afterQuestion === completedQuestion
  );
}

function nextQuestion() {
  if (state.questionIndex < state.data.questions.length - 1) {
    state.questionIndex += 1;
    state.selectedAnswerIndex = null;
    state.activeTrophy = null;
    setScreen("theme");
    return;
  }

  state.questionIndex = 0;
  state.score = 0;
  state.selectedAnswerIndex = null;
  state.activeTrophy = null;
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
