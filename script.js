/**
 * This is the main file for the Tic Tac Toe game.
 * It will be responsible for the game logic.
 */

const WINNING_COMBINATIONS = [
  // Horizontal win
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Vertical win
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonal win
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Constants
 * These are the constants that will be used throughout the game.
 * PLAYER.X: The class for the X player.
 * PLAYER.O: The class for the O player.
 */

const PLAYER = {
  X: "x",
  O: "o",
};

const STATUS = {
  Continue: "CONTINUE",
  Win: "WIN",
  Draw: "DRAW",
};

const MESSAGE = {
  Win: "Congratulations! {PLAYER} wins!",
  Draw: "It's a draw!",
};

let PLAYS_LEFT = 9;

/**
 * currentTurn
 * This variable will keep track of the current turn.
 * It will be set to the PLAYER.X by default.
 */
let currentTurn;

const cellElements = document.querySelectorAll("[data-cell]");
const board = document.getElementById("board");
const restartButton = document.getElementById("restartButton");
// get winner text html element by data-winner-text attribute
const winnerText = document.querySelector("[data-winner-text]");

// get dialog html element
const dialog = document.querySelector("dialog");

startGame();

function startGame() {
  restartButton.addEventListener("click", restartGame);

  cellElements.forEach((cell) => {
    /**
     * Add an event listener to each cell.
     * This event listener will call the handleClick function when the cell is clicked.
     * The { once: true } option will make sure that the event listener is only called once.
     */
    cell.addEventListener("click", handleClick, { once: true });
  });

  currentTurn = PLAYER.X;
  board.classList.add(currentTurn);
  PLAYS_LEFT = 9;
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = currentTurn === PLAYER.X ? PLAYER.X : PLAYER.O;

  placeMark(cell, currentClass);

  const status = checkWin(currentClass);

  if (status === STATUS.Continue) {
    swapTurns(currentClass);
    return;
  }

  dialog.showModal();
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns(currentClass) {
  board.classList.remove(currentClass);
  currentTurn = currentTurn === PLAYER.X ? PLAYER.O : PLAYER.X;
  board.classList.add(currentTurn);
}

function checkWin(currentClass) {
  PLAYS_LEFT--;

  /**
   * map through the WINNING_COMBINATIONS array.
   */
  const hasWon = WINNING_COMBINATIONS.some((combination) => {
    /**
     * map through each combination array.
     * Check if all the cells in the combination array have the currentClass.
     */
    return combination.every((index) => {
      /**
       * Check if the cell element at the index contains the currentClass.
       */
      return cellElements[index].classList.contains(currentClass);
    });
  });

  if (PLAYS_LEFT === 1) {
    const nextPlayer = currentClass === PLAYER.X ? PLAYER.O : PLAYER.X;

    const hasWon = WINNING_COMBINATIONS.some((combination) => {
      /**
       * map through each combination array.
       * Check if all the cells in the combination array have the currentClass.
       */
      return combination.every((index) => {
        /**
         * Check if the cell element at the index contains the currentClass.
         */
        return (
          cellElements[index].classList.contains(currentClass) ||
          cellElements[index].classList.contains(nextPlayer)
        );
      });
    });

    if (hasWon) {
      winnerText.innerHTML =
        currentClass === PLAYER.X
          ? MESSAGE.Win.replace("{PLAYER}", "Circle")
          : MESSAGE.Win.replace("{PLAYER}", "X");

      return STATUS.Win;
    }
  }

  if (hasWon) {
    winnerText.innerHTML =
      currentClass === PLAYER.X
        ? MESSAGE.Win.replace("{PLAYER}", "X")
        : MESSAGE.Win.replace("{PLAYER}", "Circle");

    return STATUS.Win;
  }

  const isBoardFull = checkBoardStatus();

  // Check if the board is full or there is only one cell left.
  if (isBoardFull) {
    winnerText.innerHTML = MESSAGE.Draw;
    return STATUS.Draw;
  }

  return STATUS.Continue;
}

function checkBoardStatus() {
  return Object.keys(cellElements).every((key) => {
    const cell = cellElements[key];

    return (
      cell.classList.contains(PLAYER.X) || cell.classList.contains(PLAYER.O)
    );
  });
}

function restartGame() {
  cellElements.forEach((cell) => {
    cell.classList.remove(PLAYER.X);
    cell.classList.remove(PLAYER.O);
  });

  dialog.close();
  startGame();
}
