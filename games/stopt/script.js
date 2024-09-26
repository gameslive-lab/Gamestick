import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

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

    // Atualiza a letra no Firebase
    set(ref(getDatabase(), 'currentLetter'), currentLetter)
        .then(() => {
            console.log("Letra enviada para o Firebase:", currentLetter);
        })
        .catch((error) => {
            console.error("Erro ao enviar letra para o Firebase:", error);
        });

    // Removido startTimer() daqui
}

// Função para ouvir mudanças na letra no Firebase
onValue(ref(getDatabase(), 'currentLetter'), (snapshot) => {
    const letter = snapshot.val();
    if (letter) {
        currentLetter = letter;
        document.getElementById("current-letter").textContent = currentLetter;

        // Inicia o timer de 3 segundos quando uma nova letra for recebida
        startTimer(3);
    }
});

// Timer e controle de inputs
function startTimer(seconds) {
    const timer = document.getElementById("timer");
    let timeLeft = seconds;

    timer.textContent = Prepare-se: ${timeLeft}s;

    const countdown = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            timer.textContent = Prepare-se: ${timeLeft}s;
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
    resultsDiv.innerHTML = 
        <h3>Respostas:</h3>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Fruta:</strong> ${fruta}</p>
        <p><strong>Cor:</strong> ${cor}</p>
        <p><strong>Objeto:</strong> ${objeto}</p>
        <p><strong>CEP:</strong> ${cep}</p>
        <p><strong>FND:</strong> ${fnd}</p>
    ;
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

// Função para reiniciar o jogo
function restartGame() {
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
