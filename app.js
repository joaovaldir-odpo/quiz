const state = {
  data: null,
  index: 0,
  score: 0,
  answered: false,
};

const els = {
  heroImage: document.getElementById("heroImage"),
  progress: document.getElementById("progress"),
  score: document.getElementById("score"),
  category: document.getElementById("category"),
  question: document.getElementById("question"),
  hint: document.getElementById("hint"),
  answers: document.getElementById("answers"),
  nextBtn: document.getElementById("nextBtn"),
  restartBtn: document.getElementById("restartBtn"),
  result: document.getElementById("result"),
};

function loadData() {
  if (window.QUIZ_DATA) {
    return window.QUIZ_DATA;
  }

  throw new Error("Não foi possível carregar as perguntas. Edite questions.js.");
}

function updateHeader() {
  els.progress.textContent = `${Math.min(state.index + 1, state.data.questions.length)}/${state.data.questions.length}`;
  els.score.textContent = String(state.score);
}

function renderQuestion() {
  const current = state.data.questions[state.index];
  state.answered = false;
  els.result.hidden = true;
  els.nextBtn.disabled = true;
  els.category.textContent = current.category || "";
  els.question.textContent = current.question;
  els.hint.textContent = current.hint || "";
  els.answers.innerHTML = "";

  current.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-btn";
    button.textContent = answer.text;
    button.addEventListener("click", () => selectAnswer(button, answer.correct));
    els.answers.appendChild(button);
  });

  updateHeader();
}

function selectAnswer(button, correct) {
  if (state.answered) return;
  state.answered = true;

  const buttons = [...els.answers.querySelectorAll("button")];
  buttons.forEach((btn) => (btn.disabled = true));

  if (correct) {
    state.score += 1;
    button.classList.add("correct");
    els.result.textContent = "Resposta certa.";
  } else {
    button.classList.add("wrong");
    els.result.textContent = "Resposta errada.";
  }

  const current = state.data.questions[state.index];
  buttons.forEach((btn, i) => {
    if (current.answers[i].correct) {
      btn.classList.add("correct");
    }
  });

  els.result.hidden = false;
  els.nextBtn.disabled = false;
  updateHeader();
}

function nextQuestion() {
  if (state.index < state.data.questions.length - 1) {
    state.index += 1;
    renderQuestion();
    return;
  }

  els.answers.innerHTML = "";
  els.category.textContent = "Fim";
  els.question.textContent = `Você acertou ${state.score} de ${state.data.questions.length}.`;
  els.hint.textContent = "Clique em reiniciar para jogar de novo.";
  els.result.hidden = false;
  els.result.textContent = "Quiz concluído.";
  els.nextBtn.disabled = true;
}

function restartQuiz() {
  state.index = 0;
  state.score = 0;
  renderQuestion();
}

function init() {
  state.data = loadData();
  document.title = state.data.title || "Quiz online";
  if (state.data.image) {
    els.heroImage.src = state.data.image;
    els.heroImage.alt = state.data.title || "Imagem de cenário do quiz";
    els.heroImage.addEventListener("error", () => {
      els.heroImage.removeAttribute("src");
      els.heroImage.style.display = "none";
    });
  } else {
    els.heroImage.style.display = "none";
  }
  els.nextBtn.addEventListener("click", nextQuestion);
  els.restartBtn.addEventListener("click", restartQuiz);
  renderQuestion();
}

init().catch((error) => {
  els.question.textContent = "Erro ao carregar o quiz.";
  els.hint.textContent = error.message;
  els.answers.innerHTML = "";
  els.nextBtn.disabled = true;
});
