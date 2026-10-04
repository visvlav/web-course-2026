"use strict";
let secretNumber = [];  
let history = [];       
let attempts = 0;       
let isGameOver = false;  

const guessInput      = document.getElementById("guessInput");
const checkBtn        = document.getElementById("checkBtn");
const newGameBtn      = document.getElementById("newGameBtn");
const messageEl       = document.getElementById("message");
const attemptsCountEl = document.getElementById("attemptsCount");
const historyList     = document.getElementById("historyList");
const peekCheckbox    = document.getElementById("peekCheckbox");
const secretView      = document.getElementById("secretView");

function generateSecretNumber() {
  const digits = ["0","1","2","3","4","5","6","7","8","9"];
  const result = [];

  while (result.length < 4) {
    const idx = Math.floor(Math.random() * digits.length);
    const digit = digits[idx];
    if (!result.includes(digit)) {
      result.push(digit);
    }
  }
  return result;
}
function validateInput(value) {
  if (!/^\d{4}$/.test(value)) {
    return {
      isValid: false,
      error: "Нужно ровно 4 цифры — без букв и символов."
    };
  }

  const digits = value.split("");
  if (new Set(digits).size !== 4) {
    return {
      isValid: false,
      error: "Все 4 цифры должны быть разными."
    };
  }

  return { isValid: true, digits };
}
function countBullsAndCows(secret, guess) {
  let bulls = 0;
  let cows  = 0;

  for (let i = 0; i < secret.length; i++) {
    if (secret[i] === guess[i]) {
      bulls++;
    } else if (secret.includes(guess[i])) {
      cows++;
    }
  }

  return { bulls, cows };
}

function getBullWord(n) {
  const n10 = n % 10, n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return "бык";
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return "быка";
  return "быков";
}

function getCowWord(n) {
  const n10 = n % 10, n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return "корова";
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return "коровы";
  return "коров";
}

function renderHistory() {
  historyList.innerHTML = "";

  history.forEach((item) => {
    const li = document.createElement("li");

    const guessSpan = document.createElement("span");
    guessSpan.className = "guess";
    guessSpan.textContent = item.guess;

    const resultSpan = document.createElement("span");
    resultSpan.className = "result";
    resultSpan.textContent =
      `${item.bulls} ${getBullWord(item.bulls)}, ` +
      `${item.cows} ${getCowWord(item.cows)}`;

    li.appendChild(guessSpan);
    li.appendChild(resultSpan);

    if (item.bulls === 4) {
      li.classList.add("win");
    }

    historyList.appendChild(li);
  });
}

function updateAttempts() {
  attemptsCountEl.textContent = attempts;
}

function showMessage(text, type = "") {
  messageEl.textContent = text;
  messageEl.className = "message" + (type ? " " + type : "");
}

function updateSecretView() {
  secretView.textContent = peekCheckbox.checked
    ? secretNumber.join(" ")
    : "";
}

function checkGuess() {
  if (isGameOver) return;

  const rawValue = guessInput.value.trim();
  const validation = validateInput(rawValue);

  if (!validation.isValid) {
    showMessage(validation.error, "error");
    return;
  }

  const guessDigits = validation.digits;
  const { bulls, cows } = countBullsAndCows(secretNumber, guessDigits);

  attempts++;
  history.push({ guess: rawValue, bulls, cows });

  updateAttempts();
  renderHistory();

  guessInput.value = "";
  guessInput.focus();

  if (bulls === 4) {
    isGameOver = true;
    showMessage(`Победа! Угадано за ${attempts} попыток.`, "success");
    guessInput.disabled = true;
    checkBtn.disabled = true;
  } else {
    showMessage(`Быков: ${bulls}, коров: ${cows}`);
  }
}

function newGame() {
  secretNumber = generateSecretNumber();
  history = [];
  attempts = 0;
  isGameOver = false;

  guessInput.disabled = false;
  checkBtn.disabled = false;
  guessInput.value = "";
  peekCheckbox.checked = false;

  showMessage("");
  updateAttempts();
  renderHistory();
  updateSecretView();
  guessInput.focus();
}

checkBtn.addEventListener("click", checkGuess);
newGameBtn.addEventListener("click", newGame);

guessInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") checkGuess();
});

peekCheckbox.addEventListener("change", updateSecretView);
newGame();