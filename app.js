const state = {
  data: null,
  screen: "home",
  questionIndex: 0,
  score: 0,
};

const els = {
  screenImage: document.getElementById("screenImage"),
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
  els.fallbackPanel.hidden = true;

  if (src) {
    els.screenImage.hidden = false;
    els.screenImage.src = encodeURI(src);
    els.screenImage.alt = state.data.altText?.[screen] || state.data.title;
  } else {
    els.screenImage.hidden = true;
    els.fallbackPanel.hidden = false;
  }

  renderHotspots();
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
      label: "Proxima pagina",
      x: 38,
      y: 88,
      width: 58,
      height: 11,
      action: () => setScreen("intro"),
    });
    return;
  }

  if (state.screen === "intro") {
    createHotspot({
      label: "Proxima pagina",
      x: 38,
      y: 90,
      width: 42,
      height: 5.5,
      action: () => setScreen("theme"),
    });
    return;
  }

  if (state.screen === "theme") {
    createHotspot({
      label: "Proxima pagina",
      x: 39,
      y: 80,
      width: 42,
      height: 5.5,
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
      x: 29,
      y: 70,
      width: 28,
      height: 7,
      action: () => setScreen("question"),
    });
    return;
  }

  if (state.screen === "correct") {
    createHotspot({
      label: "Proxima pagina",
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
    const area = current.answerAreas?.[index] || state.data.answerAreas[index];
    const button = createHotspot({
      label: answer.text,
      ...area,
      action: () => selectAnswer(button, answer.correct),
      className: "answer-hotspot",
    });
    button.dataset.letter = answer.letter || String.fromCharCode(65 + index);
  });
}

function selectAnswer(button, correct) {
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
    setScreen("theme");
    return;
  }

  state.questionIndex = 0;
  state.score = 0;
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
  setScreen("home");
}

try {
  init();
} catch (error) {
  els.screenImage.hidden = true;
  els.fallbackPanel.hidden = false;
  els.fallbackTitle.textContent = "Erro ao carregar o quiz";
  els.fallbackText.textContent = error.message;
}
