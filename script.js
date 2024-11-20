// Variables
let ticketNumbers;
let results = JSON.parse(localStorage.getItem("results")) || [];

const numEl = document.querySelector(".number");
const btnEl = document.querySelector(".primary");
const resetEl = document.querySelector(".reset");
const jackEl = document.querySelector(".jack");
const resultsContainerEl = document.querySelector(".results-container");
const resultsSection = document.querySelector(".results");

function init() {
  const resultItemEls = document.querySelectorAll(".results .row.body");
  resultItemEls.forEach((item) => item.remove());
  btnEl.classList.remove("disabled");

  // Update ticket numbers
  ticketNumbers = Array.from({ length: 200 }, (_, i) => i + 1);

  results.forEach((result) => {
    ticketNumbers = ticketNumbers.filter((num) => num !== result.ticketNumber);
  });

  console.log(ticketNumbers);

  if (!results.length) {
    resultsSection.style.display = "none";
    resetEl.classList.add("disabled");
  }
  if (results.length) {
    results.forEach((result) => {
      const html = `<div class="row">
          <div>${result.index}</div>
          <div>${result.ticketNumber}</div>
        </div>`;

      resultsContainerEl.insertAdjacentHTML("beforeend", html);
    });
  }
}
init();

const wait = (seconds) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

let reset = false;
let isSpinning = false;

async function Lottery() {
  isSpinning = true;

  resetEl.classList.add("disabled");
  btnEl.classList.add("disabled");

  let randNum;

  for (let i = 0; i < 55; i++) {
    randNum = Math.floor(Math.random() * ticketNumbers.length);
    // Generate a random number from 0 to length of arr
    // Add a one second delay
    // Set interval is an

    if (reset) {
      numEl.classList.add("hide");
      isSpinning = false;
      drumRoll.pause(); // Pause the audio
      drumRoll.currentTime = 0;
      return;
    }

    await wait(0.1);
    if (ticketNumbers) {
      numEl.innerHTML = ticketNumbers[randNum];
    }

    numEl.classList.remove("hide");
  }
  isSpinning = false;
  results.length && resetEl.classList.remove("disabled");
  btnEl.classList.remove("disabled");
  addToResult(ticketNumbers[randNum], results);
}

// once i click pick a winner spinning should be set to true and
// when true we shouldnt be able to go for a second spin until after the spinning is completed.

function addToResult(number, results) {
  resultsSection.style.display = "block";
  ticketNumbers = ticketNumbers.filter((num) => num !== number);

  if (ticketNumbers.length === 1) btnEl.classList.add("disabled");

  console.log(ticketNumbers);

  const newResult = {
    index: results?.at(-1)?.index + 1 || 1,
    ticketNumber: number,
  };

  results.push(newResult);
  localStorage.setItem("results", JSON.stringify(results));

  const html = `<div class="row body">
          <div>${newResult.index}</div>
          <div>${newResult.ticketNumber}</div>
        </div>`;

  resultsContainerEl.insertAdjacentHTML("beforeend", html);
  resetEl.classList.remove("disabled");
}

const jsConfetti = new JSConfetti();
let drumRoll = new Audio("./drum-roll-sound-effect.mp3");
let crash = new Audio("./crash.mp3");
btnEl.addEventListener("click", async () => {
  jackEl.classList.add("hide");

  reset = false;
  if (!isSpinning) {
    drumRoll.play();
    await Lottery();
    if (!reset) {
      crash.play();
      jsConfetti.addConfetti({
        // emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸"],

        confettiColors: [
          "#0634f0",
          "#5171f5",
          "#ff7096",
          "#fb8500",
          "#fb8500",
          "#f9bec7",
        ],
      });
    }
  }
});

resetEl.addEventListener("click", () => {
  // jsConfetti.addConfetti();
  const confirm =
    results.length &&
    window.confirm(
      "Are you sure you want to reset the results? This cannot be undone"
    );

  if (!confirm) return;

  reset = true;
  jackEl.classList.remove("hide");
  numEl.classList.add("hide");

  results = [];
  ticketNumbers;
  init();
  localStorage.removeItem("results");
});
