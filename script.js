const QUEST_STORAGE_KEY = "coulich-quest-progress";

// Replace each placeholder with the real question and accepted answer(s).
const quest = [
  { question: "Te rappelles-tu où j'ai caché tes chaussettes ? Il y a une autre chose cachée là-bas...", answer: ["Joyeux anniversaire !"], clue: "Il était un matin..." },
  { question: "Maintenant, habille-toi, on descend... Combien de boîtes aux lettres numérotées se trouvent dans ton immeuble ?", answer: ["28"], clue: "Et c'était l'anniversaire de la plus belle fille au monde !" },
  { question: "Comment s'appelle le parc à côté, où tu vas souvent ?", answer: ["square saint-lambert", "saint-lambert"], clue: "Et cette fille allait quelque part avec son copain..." },
  { question: "On longe le square à droite. En face de l'immeuble noir, on tourne à droite. Que voit-on sur le mur d'en face ?", answer: ["miroir"], clue: "Mais elle ne savait pas où ! Il fallait donc trouver..." },
  { question: "On continue tout droit, on passe le croisement jusqu'à la prochaine rue perpendiculaire. Regarde autour de toi : de quel pays s'agit-il ?", answer: ["danemark"], clue: "Cet endroit se trouve en plein cœur de Paris, mais il est pourtant entouré d'oliviers..." },
  { question: "On va jusqu'au prochain croisement et on tourne à droite. Un peu plus loin, il y a une laverie. Combien de machines à laver y a-t-il à l'intérieur ?", answer: ["31"], clue: "Il se trouve à côté d'un jardin..." },
  { question: "On continue et on passe le croisement. Combien de garçons vois-tu ?", answer: ["3"], clue: "Et également à côté d'un musée..." },
  { question: "On continue jusqu'au croisement avec l'avenue Félix-Faure. Regarde autour de toi : il s'agit de quelque chose qui nous caractérise, toi et moi. Qu'est-ce que c'est ?", answer: ["gourmands"], clue: "Dans le premier arrondissement de Paris !" },
  { question: "On continue à gauche. Romain Lepoulet ? Romain Lecanard ? Romain Le...?", answer: ["bœuf", "boeuf"], clue: "On y sert de délicieux brunchs..." },
  { question: "On continue sur l'avenue jusqu'au prochain croisement. Sur ce croisement, il y a un mot qui me fait rire. Lequel ?", answer: ["boucicaut"], clue: "Et, paraît-il, le service y est particulièrement apprécié !" },
  { question: "On continue sur l'avenue... Et on tombe sur une boulangerie ! Il y a des dessins sur les murs. Combien de croissants vois-tu ?", answer: ["3"], clue: "En plus, c'est facile d'y aller : seulement quelques stations de métro..." },
  { question: "On tourne à droite et on entre dans le parc. Il faut trouver tous les grands pots de fleurs. Combien y en a-t-il ?", answer: ["6"], clue: "Le numéro de la rue n'est pas 1, mais 2..." },
  { question: "On ressort de l'autre côté du parc. Au croisement, tourne à droite. Qu'est-ce que j'aime trop voir sur ton visage ?", answer: ["sourire"], clue: "Et la rue... Tu pourrais presque grimper dessus !" },
  { question: "Tout droit ! Que c'est moche au prochain croisement... Et le couscous maison, c'est quels jours ?", answer: ["jeudi", "vendredi", "jeudi, vendredi", "jeudi vendredi"], clue: "Son nom te donnera peut-être envie de prendre de la hauteur..." },
  { question: "On longe la rue. Quel est le nom de la friperie où j'ai acheté une super casquette ?", answer: ["kikiwaka", "kiki waka"], clue: "Le brunch serait-il meilleur que le nôtre ?" },
  { question: "On continue à droite. Trouve la lettre rose !", answer: ["z"], clue: "À l'adresse..." },
  { question: "On longe le parc... Et voilà le métro ! Combien de stations dessert cette ligne interminable ?", answer: ["38"], clue: "2, rue de l'Échelle." },
  { question: "2, rue de l'Échelle.", answer: ["2, rue de l'échelle", "2 rue de l'échelle", "2, rue de l'echelle", "2 rue de l'echelle"], clue: "" }
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
