const game = document.getElementById('game');
const statusDisplay = document.getElementById('status');
const xCounterDisplay = document.getElementById('xCounter');
const oCounterDisplay = document.getElementById('oCounter');
const currentPlayerDisplay = document.getElementById('currentPlayerDisplay'); // Elemento que mostra o jogador atual
const turnIndicator = document.getElementById('turnIndicator'); // Elemento indicador de turno

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let xWins = 0;
let oWins = 0;

// Novas variáveis para alternar quem começa
let starterPlayer = 'X'; // Jogador que começa a partida

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

function createBoard() {
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.setAttribute('data-cell-index', index);
        cellElement.addEventListener('click', handleCellClick);
        cellElement.innerText = cell;
        game.appendChild(cellElement);
    });
}

function handleCellClick(event) {
    const cellIndex = event.target.getAttribute('data-cell-index');
    if (board[cellIndex] !== '' || !isGameActive) {
        return;
    }
    board[cellIndex] = currentPlayer;
    event.target.innerText = currentPlayer;
    event.target.classList.add(currentPlayer === 'X' ? 'x' : 'o');
    checkResult();
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === '' || board[b] === '' || board[c] === '') {
            continue;
        }
        if (board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }
    if (roundWon) {
        statusDisplay.innerText = `Jogador ${currentPlayer} ganhou!`;
        isGameActive = false;
        updateScore(currentPlayer);
        return;
    }
    if (!board.includes('')) {
        statusDisplay.innerText = 'Empate!';
        isGameActive = false;
        return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnIndicator(); // Atualiza a vez do jogador
}

function updateScore(winner) {
    if (winner === 'X') {
        xWins++;
        xCounterDisplay.innerText = xWins;
    } else {
        oWins++;
        oCounterDisplay.innerText = oWins;
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    currentPlayer = starterPlayer; // Começa com o jogador que foi definido
    statusDisplay.innerText = '';
    game.innerHTML = '';
    createBoard();
    starterPlayer = starterPlayer === 'X' ? 'O' : 'X'; // Alterna quem começa
    updateTurnIndicator(); // Atualiza a vez do jogador
}

function updateTurnIndicator() {
    currentPlayerDisplay.innerText = currentPlayer; // Atualiza o texto para mostrar o jogador atual
    turnIndicator.classList.toggle('xTurn', currentPlayer === 'X'); // Aplica a classe 'xTurn' se for X
    turnIndicator.classList.toggle('oTurn', currentPlayer === 'O'); // Aplica a classe 'oTurn' se for O
}

createBoard();
updateTurnIndicator(); // Mostra a vez do jogador no início do jogo
