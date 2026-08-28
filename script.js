const QUEST_STORAGE_KEY = "coulich-quest-progress";

// Replace each placeholder with the real question and accepted answer(s).
const quest = [
  { question: "[PLACEHOLDER QUESTION 01]", answer: ["PLACEHOLDER_01"], clue: "[PLACEHOLDER INDICE 01]" },
  { question: "[PLACEHOLDER QUESTION 02]", answer: ["PLACEHOLDER_02"], clue: "[PLACEHOLDER INDICE 02]" },
  { question: "[PLACEHOLDER QUESTION 03]", answer: ["PLACEHOLDER_03"], clue: "[PLACEHOLDER INDICE 03]" },
  { question: "[PLACEHOLDER QUESTION 04]", answer: ["PLACEHOLDER_04"], clue: "[PLACEHOLDER INDICE 04]" },
  { question: "[PLACEHOLDER QUESTION 05]", answer: ["PLACEHOLDER_05"], clue: "[PLACEHOLDER INDICE 05]" },
  { question: "[PLACEHOLDER QUESTION 06]", answer: ["PLACEHOLDER_06"], clue: "[PLACEHOLDER INDICE 06]" },
  { question: "[PLACEHOLDER QUESTION 07]", answer: ["PLACEHOLDER_07"], clue: "[PLACEHOLDER INDICE 07]" },
  { question: "[PLACEHOLDER QUESTION 08]", answer: ["PLACEHOLDER_08"], clue: "[PLACEHOLDER INDICE 08]" },
  { question: "[PLACEHOLDER QUESTION 09]", answer: ["PLACEHOLDER_09"], clue: "[PLACEHOLDER INDICE 09]" },
  { question: "[PLACEHOLDER QUESTION 10]", answer: ["PLACEHOLDER_10"], clue: "[PLACEHOLDER INDICE 10]" },
  { question: "[PLACEHOLDER QUESTION 11]", answer: ["PLACEHOLDER_11"], clue: "[PLACEHOLDER INDICE 11]" },
  { question: "[PLACEHOLDER QUESTION 12]", answer: ["PLACEHOLDER_12"], clue: "[PLACEHOLDER INDICE 12]" },
  { question: "[PLACEHOLDER QUESTION 13]", answer: ["PLACEHOLDER_13"], clue: "[PLACEHOLDER INDICE 13]" },
  { question: "[PLACEHOLDER QUESTION 14]", answer: ["PLACEHOLDER_14"], clue: "[PLACEHOLDER INDICE 14]" },
  { question: "[PLACEHOLDER QUESTION 15]", answer: ["PLACEHOLDER_15"], clue: "[PLACEHOLDER INDICE 15]" },
  { question: "[PLACEHOLDER QUESTION 16]", answer: ["PLACEHOLDER_16"], clue: "[PLACEHOLDER INDICE 16]" },
  { question: "[PLACEHOLDER QUESTION 17]", answer: ["PLACEHOLDER_17"], clue: "[PLACEHOLDER INDICE 17]" },
  { question: "[PLACEHOLDER QUESTION 18]", answer: ["PLACEHOLDER_18"], clue: "[PLACEHOLDER INDICE 18]" }
];

const elements = {
  welcome: document.querySelector("#welcome-screen"),
  quest: document.querySelector("#quest-screen"),
  clue: document.querySelector("#clue-screen"),
  complete: document.querySelector("#complete-screen"),
  start: document.querySelector("#start-button"),
  welcomeReset: document.querySelector("#reset-welcome-button"),
  welcomePhoto: document.querySelector("#welcome-photo"),
  restart: document.querySelector("#restart-button"),
  next: document.querySelector("#next-button"),
  clueRestart: document.querySelector("#clue-restart-button"),
  allClues: document.querySelector("#all-clues-button"),
  cluePhoto: document.querySelector("#clue-photo"),
  quit: document.querySelector("#quit-button"),
  form: document.querySelector("#answer-form"),
  input: document.querySelector("#answer-input"),
  message: document.querySelector("#answer-message"),
  index: document.querySelector("#question-index"),
  title: document.querySelector("#question-title"),
  clueTitle: document.querySelector("#clue-title"),
  clueList: document.querySelector("#clue-list")
};

let currentIndex = 0;
let started = false;

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(QUEST_STORAGE_KEY));
    return saved && Number.isInteger(saved.currentIndex) && saved.currentIndex >= 0 && saved.currentIndex < quest.length ? saved : null;
  } catch {
    return null;
  }
}

function saveProgress() {
  localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify({ currentIndex, started: true }));
}

function clearProgress() {
  localStorage.removeItem(QUEST_STORAGE_KEY);
  currentIndex = 0;
  started = false;
  elements.welcomeReset.hidden = true;
}

function showScreen(screen) {
  [elements.welcome, elements.quest, elements.clue, elements.complete].forEach((item) => { item.hidden = item !== screen; });
}

function renderQuestion() {
  const item = quest[currentIndex];
  const number = String(currentIndex + 1).padStart(2, "0");
  elements.index.textContent = number;
  elements.title.textContent = item.question;
  elements.input.value = "";
  elements.message.textContent = "";
  elements.message.className = "answer-message";
  showScreen(elements.quest);
  elements.input.focus();
}

function normalize(value) {
  return value.trim().toLocaleLowerCase("fr-FR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function showClue() {
  elements.clueTitle.textContent = quest[currentIndex].clue;
  const isLastClue = currentIndex === quest.length - 1;
  elements.next.hidden = isLastClue;
  elements.clueRestart.hidden = !isLastClue;
  elements.allClues.hidden = !isLastClue;
  showScreen(elements.clue);
  (isLastClue ? elements.allClues : elements.next).focus();
}

function renderClueTable() {
  elements.clueList.replaceChildren(...quest.map((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `<th scope="row">${String(index + 1).padStart(2, "0")}</th><td>${item.clue}</td>`;
    return row;
  }));
}

function submitAnswer(event) {
  event.preventDefault();
  const answer = normalize(elements.input.value);
  if (!answer) {
    elements.message.textContent = "Écris une réponse avant de continuer.";
    elements.message.className = "answer-message error";
    elements.input.focus();
    return;
  }
  const acceptedAnswers = quest[currentIndex].answer.map(normalize);
  if (!acceptedAnswers.includes(answer)) {
    elements.message.textContent = "Essaie encore !";
    elements.message.className = "answer-message error";
    elements.input.select();
    return;
  }
  elements.message.textContent = "";
  elements.message.className = "answer-message success";
  showClue();
}

function continueAfterClue() {
  currentIndex += 1;
  if (currentIndex === quest.length) {
    localStorage.removeItem(QUEST_STORAGE_KEY);
    return;
  }
  saveProgress();
  renderQuestion();
}

function showAllClues() {
  renderClueTable();
  showScreen(elements.complete);
  elements.restart.focus();
}

function beginQuest() {
  started = true;
  saveProgress();
  renderQuestion();
}

function returnToWelcome() {
  if (started) saveProgress();
  showScreen(elements.welcome);
  elements.welcomeReset.hidden = false;
  elements.start.textContent = "Continuer ↗";
  elements.start.focus();
}

function restartQuest() {
  clearProgress();
  elements.start.textContent = "Coulich ↗";
  beginQuest();
}

elements.start.addEventListener("click", beginQuest);
elements.welcomePhoto.addEventListener("load", () => {
  elements.welcomePhoto.hidden = false;
  elements.welcomePhoto.style.display = "block";
});
elements.welcomePhoto.addEventListener("error", () => {
  elements.welcomePhoto.hidden = true;
  elements.welcomePhoto.style.display = "none";
});
elements.cluePhoto.addEventListener("load", () => {
  elements.cluePhoto.hidden = false;
  elements.cluePhoto.style.display = "block";
});
elements.cluePhoto.addEventListener("error", () => {
  elements.cluePhoto.hidden = true;
  elements.cluePhoto.style.display = "none";
});
elements.welcomeReset.addEventListener("click", () => { clearProgress(); elements.start.textContent = "Coulich ↗"; elements.start.focus(); });
elements.restart.addEventListener("click", restartQuest);
elements.next.addEventListener("click", continueAfterClue);
elements.clueRestart.addEventListener("click", restartQuest);
elements.allClues.addEventListener("click", showAllClues);
elements.quit.addEventListener("click", returnToWelcome);
elements.form.addEventListener("submit", submitAnswer);

const savedProgress = loadProgress();
if (savedProgress) {
  currentIndex = savedProgress.currentIndex;
  started = true;
  elements.start.textContent = "Continuer ↗";
  elements.welcomeReset.hidden = false;
}
