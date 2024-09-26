import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

const db = getDatabase(); // Obtém a instância do banco de dados
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
let currentLetter = "";

// Adicione eventos de clique
document.getElementById("generate-letter").addEventListener("click", generateLetter);
document.getElementById("stop-button").addEventListener("click", handleSubmit);
document.getElementById("restart-button").addEventListener("click", restartGame);

// Função para gerar a letra e atualizar o Firebase
function generateLetter() {
    const randomIndex = Math.floor(Math.random() * letters.length);
    currentLetter = letters[randomIndex];
    document.getElementById("current-letter").textContent = currentLetter;

    // Atualiza a letra e o estado do jogo no Firebase
    set(ref(db, 'game'), {
        currentLetter: currentLetter,
        state: 'playing' // Estado inicial do jogo
    }).then(() => {
        console.log("Estado do jogo e letra atualizados no Firebase:", currentLetter);
    }).catch((error) => {
        console.error("Erro ao enviar estado do jogo para o Firebase:", error);
    });
}

// Função para ouvir mudanças na letra e no estado do jogo no Firebase
onValue(ref(db, 'game'), (snapshot) => {
    const gameData = snapshot.val();
    if (gameData) {
        currentLetter = gameData.currentLetter;
        document.getElementById("current-letter").textContent = currentLetter;

        // Se o estado do jogo for "stopped", todos entram no modo de parada
        if (gameData.state === 'stopped') {
            handleStopState();
        } else if (gameData.state === 'playing') {
            resetGameState();
        }
    }
});

// Timer e controle de inputs
function startTimer(seconds) {
    const timer = document.getElementById("timer");
    let timeLeft = seconds;

    timer.textContent = `Prepare-se: ${timeLeft}s`;

    const countdown = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            timer.textContent = `Prepare-se: ${timeLeft}s`;
        } else {
            clearInterval(countdown);
            timer.textContent = '';
            enableInputs();
        }
    }, 1000);

    disableInputs();
}

function disableInputs() {
    document.querySelectorAll(".form-input").forEach(input => {
        input.disabled = true;
    });
}

function enableInputs() {
    document.querySelectorAll(".form-input").forEach(input => {
        input.disabled = false;
    });
}

// Função para tratar o envio do formulário
function handleSubmit(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const fruta = document.getElementById("fruta").value;
    const cor = document.getElementById("cor").value;
    const objeto = document.getElementById("objeto").value;
    const cep = document.getElementById("cep").value;
    const fnd = document.getElementById("fnd").value;

    // Exibe os resultados
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `
        <h3>Respostas:</h3>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Fruta:</strong> ${fruta}</p>
        <p><strong>Cor:</strong> ${cor}</p>
        <p><strong>Objeto:</strong> ${objeto}</p>
        <p><strong>CEP:</strong> ${cep}</p>
        <p><strong>FND:</strong> ${fnd}</p>
    `;
    resultsDiv.style.display = "block";
    resultsDiv.style.opacity = "1";

    // Desativa todos os inputs e o botão "Stop"
    document.querySelectorAll(".form-input").forEach(input => {
        input.disabled = true;
    });
    document.getElementById("stop-button").disabled = true;

    // Atualiza o estado do jogo para "stopped" no Firebase
    set(ref(db, 'game/state'), 'stopped')
        .then(() => {
            console.log("Jogo parado.");
        })
        .catch((error) => {
            console.error("Erro ao atualizar estado do jogo para 'stopped':", error);
        });
}

// Função para reiniciar o jogo
function restartGame() {
    // Atualiza o estado do jogo para "playing" no Firebase
    set(ref(db, 'game/state'), 'playing')
        .then(() => {
            console.log("Jogo reiniciado.");
        })
        .catch((error) => {
            console.error("Erro ao atualizar estado do jogo para 'playing':", error);
        });
}

// Função para resetar o estado do jogo
function resetGameState() {
    // Limpa os inputs
    document.querySelectorAll(".form-input").forEach(input => {
        input.value = "";
        input.disabled = false;
    });

    // Oculta os resultados e reseta o jogo
    document.getElementById("results").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("results").style.display = "none";
    }, 500);

    document.getElementById("stop-button").disabled = false;
    document.getElementById("restart-button").style.display = "none";
    document.getElementById("current-letter").textContent = "A";
}

// Função para entrar no estado de "stopped"
function handleStopState() {
    // Exibe os resultados para todos
    const resultsDiv = document.getElementById("results");
    resultsDiv.style.display = "block";
    resultsDiv.style.opacity = "1";

    // Desativa todos os inputs e o botão "Stop"
    document.querySelectorAll(".form-input").forEach(input => {
        input.disabled = true;
    });
    document.getElementById("stop-button").disabled = true;

    // Exibe o botão de reiniciar
    document.getElementById("restart-button").style.display = "block";
}
