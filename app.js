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
  y: 90,
  width: 58,
  height: 7.6,
};

const SCREEN_RENDERERS = {
  home: renderHome,
  intro: renderIntro,
  theme: renderTheme,
  question: renderQuestionScreen,
  wrong: renderWrongScreen,
  correct: renderCorrectScreen,
  stickerFull: renderStickerFullScreen,
  demo: renderDemoScreen,
  demoSticker: renderDemoStickerScreen,
  demoStickerFull: renderDemoStickerFullScreen,
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

  return false;
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
    "demo",
    "demoSticker",
    "demoStickerFull",
    "trophy",
  ];

  if (allowedScreens.includes(screen)) {
    return screen;
  }

  return "home";
}

function initialQuestionIndex(data) {
  const params = new URLSearchParams(window.location.search);
  const question = Number.parseInt(params.get("question"), 10);

  if (
    Number.isInteger(question) &&
    question >= 1 &&
    question <= data.questions.length
  ) {
    return question - 1;
  }

  return 0;
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

  bindScreenControls();
}

function renderHome() {
  els.contentLayer.hidden = false;
  els.contentLayer.innerHTML = `
    <article class="home-page">
      <img class="home-image" src="${escapeAttribute(state.data.screens?.home || "")}" alt="${escapeAttribute(state.data.title || "")}" />
      ${renderNextButton("intro")}
    </article>
  `;
}

function renderIntro() {
  const intro = state.data.intro || {};
  els.contentLayer.hidden = false;
  els.contentLayer.innerHTML = `
    <article class="intro-page">
      ${renderParagraphs(intro.paragraphs)}
      ${renderNextButton("theme")}
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
      ${theme.speech ? `<div class="theme-speech ${theme.speechClass || ""}"${styleAttribute(theme.speechStyle)}>${formatText(theme.speech)}</div>` : ""}
      ${renderImage("theme-character", theme.character, theme.characterStyle)}
      <section class="theme-copy ${theme.copyClass || ""}"${styleAttribute(theme.copyStyle)}>
        ${renderTextWrapSpacer(theme.wrapAvoidStyle)}
        ${renderParagraphs(theme.paragraphs)}
      </section>
      ${renderNextButton("question", theme.nextButton)}
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
      <div class="question-speech ${questionScreen.speechClass || ""}"${styleAttribute(questionScreen.speechStyle)}>${formatText(questionScreen.speech || "")}</div>
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
      <div class="wrong-speech ${wrongScreen.speechClass || ""}"${styleAttribute(wrongScreen.speechStyle)}>${formatText(wrongScreen.speech || "")}</div>
      <div class="wrong-question"${styleAttribute(wrongScreen.questionStyle)}>${formatText(wrongScreen.question || current.question)}</div>
      <div class="wrong-answer"${styleAttribute(wrongScreen.answerStyle)}>
        <span aria-hidden="true">X</span>
        <p>${formatText(wrongAnswer?.text || "")}</p>
      </div>
      ${renderBackControl(wrongScreen.backControlStyle || wrongScreen.backButtonStyle)}
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
      ${renderNextButton("stickerFull", correctScreen.nextButton)}
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
      ${renderNextButton(current.demoScreen ? "demo" : "completeQuestion", stickerFull.nextButton)}
    </article>
  `;
}

function renderDemoScreen() {
  const current = currentQuestion();
  const demo = current.demoScreen || {};
  els.contentLayer.hidden = false;
  els.contentLayer.innerHTML = `
    <article class="demo-page">
      <img class="demo-bg" src="${escapeAttribute(demo.background || "")}" alt="" />
      ${renderScreenHeader("demo-topbar")}
      ${renderImage("demo-character", demo.character, demo.characterStyle)}
      <div class="demo-note"${styleAttribute(demo.noteStyle)}>${formatText(demo.note || "")}</div>
      <div class="demo-board"${styleAttribute(demo.boardStyle)}>${formatText(demo.board || "")}</div>
      <div class="demo-copy"${styleAttribute(demo.copyStyle)}>${formatText(demo.copy || "")}</div>
      ${renderOpenStickerButton("demoSticker", demo.openButton)}
    </article>
  `;
}

function renderDemoStickerScreen() {
  const current = currentQuestion();
  const demoSticker = current.demoStickerScreen || {};
  els.contentLayer.hidden = false;
  els.contentLayer.innerHTML = `
    <article class="correct-page">
      <img class="correct-bg" src="${escapeAttribute(demoSticker.background || "")}" alt="" />
      <div class="correct-logos">
        <div class="screen-logo screen-logo-left">LOGO<br />ESCOLA</div>
        <div class="screen-logo screen-logo-right">LOGO<br />Consultoria</div>
      </div>
      ${renderImage("sticker-header", demoSticker.header, demoSticker.headerStyle)}
      <div class="sticker-title"${styleAttribute(demoSticker.titleStyle)}>${formatText(demoSticker.title || "")}</div>
      ${renderImage("sticker-card", demoSticker.sticker, demoSticker.stickerStyle)}
      ${renderNextButton("demoStickerFull", demoSticker.nextButton)}
    </article>
  `;
}

function renderDemoStickerFullScreen() {
  const current = currentQuestion();
  const demoStickerFull = current.demoStickerFullScreen || {};
  els.contentLayer.hidden = false;
  els.contentLayer.innerHTML = `
    <article class="sticker-full-page">
      <img class="sticker-full-bg" src="${escapeAttribute(demoStickerFull.background || "")}" alt="" />
      ${renderImage("sticker-full-card", demoStickerFull.sticker, demoStickerFull.stickerStyle)}
      ${renderNextButton("completeQuestion", demoStickerFull.nextButton)}
    </article>
  `;
}

function renderTrophyScreen() {
  const trophy =
    state.activeTrophy ||
    trophyForCompletedQuestion(state.questionIndex + 1) ||
    {};
  els.contentLayer.hidden = false;
  els.contentLayer.innerHTML = `
    <article class="trophy-page">
      ${renderImage("trophy-bg", trophy.background, trophy.backgroundStyle)}
      ${renderImage("trophy-image", trophy.image, trophy.imageStyle)}
      <div class="trophy-title"${styleAttribute(trophy.titleStyle)}>${formatText(trophy.title || "")}</div>
      <div class="trophy-text"${styleAttribute(trophy.textStyle)}>${formatText(trophy.text || "")}</div>
      ${renderNextButton("nextQuestion", trophy.nextButton)}
    </article>
  `;
}

function renderScreenHeader(extraClass = "") {
  const sectionTitle =
    currentQuestion()?.sectionTitle ||
    state.data.sectionTitle ||
    "ECA DIGITAL - seção - 01";

  return `
    <header class="screen-topbar ${extraClass}">
      <div class="screen-logo screen-logo-left">LOGO<br />ESCOLA</div>
      <div class="screen-section">${formatText(sectionTitle)}</div>
      <div class="screen-logo screen-logo-right">LOGO<br />Consultoria</div>
    </header>
  `;
}

function renderImage(className, src, style = {}) {
  if (!src) return "";
  return `<img class="${className}" src="${escapeAttribute(src)}" alt=""${styleAttribute(style)} />`;
}

function renderTextWrapSpacer(style = {}) {
  if (!Object.keys(style).length) return "";
  const { side = "right", ...spacerStyle } = style;
  const sideClass = side === "left" ? "is-left" : "is-right";
  return `<span class="text-wrap-spacer ${sideClass}" aria-hidden="true"${styleAttribute(spacerStyle)}></span>`;
}

function renderNextButton(action, style = {}) {
  return `
    <button
      type="button"
      class="next-page-button"
      data-nav-action="${escapeAttribute(action)}"
      ${navigationStyleAttribute({ ...DEFAULT_NEXT_BUTTON, ...style })}
    >
      <span>Próxima página</span>
    </button>
  `;
}

function renderBackControl(style = {}) {
  return `
    <button type="button" class="back-control" data-nav-action="question"${styleAttribute(positionOnlyStyle(style))}>
      <span class="back-button-visual">Volte</span>
      <span class="back-arrow" aria-hidden="true"></span>
    </button>
  `;
}

function renderOpenStickerButton(action, style = {}) {
  return `
    <button type="button" class="open-sticker-button" data-nav-action="${escapeAttribute(action)}"${styleAttribute(style)}>
      Abrir<br />figurinha
    </button>
  `;
}

function renderParagraphs(paragraphs = []) {
  return paragraphs.map((paragraph) => `<p>${formatText(paragraph)}</p>`).join("");
}

function renderAnswerCards(question) {
  const cards = question.questionScreen?.answerCards || [];
  const cardClass = question.questionScreen?.answerClass || "";

  return question.answers
    .map((answer, index) => {
      const letter = answer.letter || String.fromCharCode(65 + index);
      const style = cards[index] || {};

      return `
        <button
          type="button"
          class="answer-card ${cardClass}"
          data-answer-index="${index}"
          data-answer-correct="${answer.correct ? "true" : "false"}"
          aria-label="${escapeAttribute(answer.text || "")}"
          ${styleAttribute(style)}
        >
          <span>${formatText(letter)}</span>
          <p>${formatText(answer.text || "")}</p>
        </button>
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

function positionOnlyStyle(style = {}) {
  const { top, right, bottom, left } = style;
  return { top, right, bottom, left };
}

function navigationStyleAttribute(style = {}) {
  const rules = Object.entries(style)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([property, value]) => {
      const cssProperty =
        property === "x"
          ? "left"
          : property === "y"
            ? "top"
            : property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      const cssValue =
        ["x", "y", "width", "height"].includes(property) && typeof value === "number"
          ? `${value}%`
          : typeof value === "number"
            ? `${value}px`
            : String(value);
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

function bindScreenControls() {
  if (state.screen === "question") {
    bindAnswerCards();
  }

  els.contentLayer.querySelectorAll("[data-nav-action]").forEach((control) => {
    control.addEventListener("click", () => runNavAction(control.dataset.navAction));
  });
}

function runNavAction(action) {
  if (action === "completeQuestion") {
    completeQuestion();
    return;
  }

  if (action === "nextQuestion") {
    nextQuestion();
    return;
  }

  setScreen(action);
}

function bindAnswerCards() {
  const current = currentQuestion();
  els.contentLayer.querySelectorAll(".answer-card").forEach((card) => {
    const index = Number.parseInt(card.dataset.answerIndex, 10);
    const answer = current.answers[index];

    card.addEventListener("click", () => {
      selectAnswer(card, answer.correct, index);
    });
  });
}

function selectAnswer(card, correct, index) {
  state.selectedAnswerIndex = index;
  els.contentLayer
    .querySelectorAll(".answer-card")
    .forEach((answerCard) => {
      answerCard.disabled = true;
      answerCard.classList.remove("selected-correct", "selected-wrong");
    });
  card.classList.add(correct ? "selected-correct" : "selected-wrong");

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
  state.questionIndex = initialQuestionIndex(state.data);
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
