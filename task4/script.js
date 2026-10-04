"use strict";

// ==== Состояние игры ====
let secretNumber = [];       // массив цифр, например ['1','2','3','4']
let history = [];            // массив объектов: { guess: "1234", bulls: 1, cows: 2 }
let attempts = 0;            // количество попыток
let isGameOver = false;      // завершена ли игра

// ==== Ссылки на DOM-элементы ====
const guessInput = document.getElementById("guessInput");
const checkBtn = document.getElementById("checkBtn");
const newGameBtn = document.getElementById("newGameBtn");
const messageEl = document.getElementById("message");
const attemptsCountEl = document.getElementById("attemptsCount");
const historyList = document.getElementById("historyList");

// ==== Генерация загаданного числа ====
function generateSecretNumber() {
  const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const result = [];

  while (result.length < 4) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    const digit = digits[randomIndex];

    // проверяем, что такой цифры ещё нет
    if (!result.includes(digit)) {
      result.push(digit);
    }
  }

  return result;
}

// ==== Валидация ввода ====
function validateInput(value) {
  // ровно 4 символа, и все они — цифры
  if (!/^\d{4}$/.test(value)) {
    return {
      isValid: false,
      error: "Введите ровно 4 цифры (только цифры, без букв и символов)."
    };
  }

  const digits = value.split("");

  // проверяем, что все цифры разные
  const uniqueDigits = new Set(digits);
  if (uniqueDigits.size !== 4) {
    return {
      isValid: false,
      error: "Все 4 цифры должны быть разными."
    };
  }

  return { isValid: true, digits };
}

// ==== Подсчёт быков и коров ====
function countBullsAndCows(secret, guess) {
  let bulls = 0;
  let cows = 0;

  for (let i = 0; i < secret.length; i++) {
    if (secret[i] === guess[i]) {
      // цифра на своём месте
      bulls++;
    } else if (secret.includes(guess[i])) {
      // цифра есть в секрете, но не на этом месте
      cows++;
    }
  }

  return { bulls, cows };
}

// ==== Склонение слов (для красоты) ====
function getBullWord(n) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return "бык";
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return "быка";
  return "быков";
}

function getCowWord(n) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return "корова";
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return "коровы";
  return "коров";
}

// ==== Отрисовка истории из массива ====
function renderHistory() {
  historyList.innerHTML = "";

  history.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.guess} → ${item.bulls} ${getBullWord(item.bulls)}, ${item.cows} ${getCowWord(item.cows)}`;
    historyList.appendChild(li);
  });
}

// ==== Обновление счётчика попыток ====
function updateAttempts() {
  attemptsCountEl.textContent = attempts;
}

// ==== Сообщение пользователю ====
function showMessage(text, type = "") {
  messageEl.textContent = text;
  messageEl.className = "message" + (type ? " " + type : "");
}

// ==== Основная проверка попытки ====
function checkGuess() {
  if (isGameOver) {
    return;
  }

  const rawValue = guessInput.value.trim();
  const validation = validateInput(rawValue);

  if (!validation.isValid) {
    showMessage(validation.error, "error");
    return;
  }

  const guessDigits = validation.digits;
  const { bulls, cows } = countBullsAndCows(secretNumber, guessDigits);

  attempts++;
  history.push({
    guess: rawValue,
    bulls,
    cows
  });

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

// ==== Новая игра ====
function newGame() {
  secretNumber = generateSecretNumber();
  history = [];
  attempts = 0;
  isGameOver = false;

  guessInput.disabled = false;
  checkBtn.disabled = false;
  guessInput.value = "";
  showMessage("");
  updateAttempts();
  renderHistory();
  guessInput.focus();

  // Для отладки можно посмотреть загаданное число в консоли:
  // console.log("Загадано:", secretNumber.join(""));
}

// ==== Обработчики событий ====
checkBtn.addEventListener("click", checkGuess);

newGameBtn.addEventListener("click", newGame);

guessInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkGuess();
  }
});

// ==== Старт игры ====
newGame();