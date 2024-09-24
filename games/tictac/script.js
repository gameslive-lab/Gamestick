const cells = [];
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
const clickSound = document.getElementById('click-sound');
const scoreXElement = document.getElementById('score-x');
const scoreOElement = document.getElementById('score-o');
const currentTurnElement = document.getElementById('current-turn');
const board = ['', '', '', '', '', '', '', '', ''];

let currentPlayer = 'X'; // Começa sempre com X
let gameActive = true;
let playerXMoves = [];
let playerOMoves = [];
let scoreX = 0;
let scoreO = 0;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Inicializa o tabuleiro
function initGameBoard() {
  const gameBoard = document.getElementById('game-board');
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-index', i);
    cell.addEventListener('click', handleCellClick);
    gameBoard.appendChild(cell);
    cells.push(cell);
  }
}

// Lida com o clique nas células
function handleCellClick(e) {
  const cell = e.target;
  const index = parseInt(cell.getAttribute('data-index'));

  if (board[index] !== '' || !gameActive) return;

  clickSound.play().catch(error => {
    console.error('Erro ao reproduzir o som:', error);
  });

  cell.classList.add(currentPlayer.toLowerCase());
  if (currentPlayer === 'X') {
    handlePlayerMove(playerXMoves, index, 'x');
  } else {
    handlePlayerMove(playerOMoves, index, 'o');
  }

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;

  checkForWinner();
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateCurrentTurnDisplay();
}

// Manipula o movimento do jogador
function handlePlayerMove(playerMoves, index, className) {
  if (playerMoves.length < 3) {
    playerMoves.push(index);
  } else {
    const firstMove = playerMoves.shift();
    board[firstMove] = '';
    const firstCell = document.querySelector(`.cell[data-index='${firstMove}']`);
    firstCell.textContent = '';
    firstCell.classList.remove(className);
    playerMoves.push(index);
  }

  if (playerMoves.length === 3) {
    const lastMoveIndex = playerMoves[0];
    document.querySelector(`.cell[data-index='${lastMoveIndex}']`).classList.add('highlight');
  }
}

// Verifica se há um vencedor
function checkForWinner() {
  let roundWon = false;

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    message.textContent = `Jogador ${currentPlayer} venceu!`;
    currentTurnElement.textContent = `${currentPlayer} venceu!`;
    updateScore();
    resetButton.style.display = 'block'; // Exibe o botão de reiniciar
    gameActive = false;
    return;
  }

  if (!board.includes('')) {
    message.textContent = 'Empate!';
    gameActive = false;
  }
}

// Atualiza o placar
function updateScore() {
  if (currentPlayer === 'X') {
    scoreX++;
    scoreXElement.textContent = scoreX;
  } else {
    scoreO++;
    scoreOElement.textContent = scoreO;
  }
}

// Reinicia o jogo
function resetGame() {
  board.fill('');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o', 'highlight');
  });
  playerXMoves = [];
  playerOMoves = [];
  currentPlayer = (scoreX > scoreO) ? 'X' : 'O'; // Define quem começa com base no vencedor anterior
  gameActive = true;
  resetButton.style.display = 'none'; // Oculta o botão ao reiniciar
  message.textContent = '';
  updateCurrentTurnDisplay();
}

// Atualiza o display de quem está jogando
function updateCurrentTurnDisplay() {
  currentTurnElement.textContent = `Vez de: ${currentPlayer}`;
}

// Inicializa o jogo
initGameBoard();
updateCurrentTurnDisplay(); // Atualiza na primeira carga
resetButton.addEventListener('click', resetGame);
