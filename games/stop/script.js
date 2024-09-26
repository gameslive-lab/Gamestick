// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

// Sua configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBlpKkao5lSnWjbowVbi58auUdaKMfPQ5M",
    authDomain: "stop-a5326.firebaseapp.com",
    databaseURL: "https://stop-a5326-default-rtdb.firebaseio.com",
    projectId: "stop-a5326",
    storageBucket: "stop-a5326.appspot.com",
    messagingSenderId: "155692361842",
    appId: "1:155692361842:web:581fbc770e89a9d46a3aeb",
    measurementId: "G-FKKWWHG6PN"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();

// Variáveis Globais
const startButton = document.getElementById('start-btn');
const generateLetterButton = document.getElementById('generate-letter-btn');
const stopForm = document.getElementById('stop-form');
const letterDisplay = document.getElementById('letter-display');
const timerDisplay = document.getElementById('timer');

// Função para inicializar o jogo
startButton.addEventListener('click', () => {
    document.getElementById('game-area').style.display = 'block';
    startButton.style.display = 'none';
});

// Função para gerar uma letra aleatória
generateLetterButton.addEventListener('click', () => {
    randomizeLetter();
    disableInputs(true); // Desabilita inputs e botão Stop durante o timer
    startTimer(3); // Inicia o timer de 3 segundos
});

// Função para sorteio da letra aleatória
function randomizeLetter() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    const randomLetter = alphabet[randomIndex];
    letterDisplay.innerText = randomLetter;
}

// Função para iniciar o timer
function startTimer(seconds) {
    timerDisplay.innerText = `Iniciando em: ${seconds}`;
    const countdown = setInterval(() => {
        seconds--;
        if (seconds > 0) {
            timerDisplay.innerText = `Iniciando em: ${seconds}`;
        } else {
            clearInterval(countdown);
            timerDisplay.innerText = ''; // Limpa o timer
            disableInputs(false); // Habilita inputs e botão Stop
        }
    }, 1000);
}

// Função para desabilitar/abilitar inputs e botão Stop
function disableInputs(disabled) {
    const inputs = stopForm.querySelectorAll('input');
    inputs.forEach(input => input.disabled = disabled);
    stopForm.querySelector('button[type="submit"]').disabled = disabled;
}

// Lógica para resetar o jogo
stopForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Coletar respostas
    const responses = Array.from(stopForm.querySelectorAll('input'))
        .map(input => `${input.placeholder}: ${input.value || "Não preenchido"}`)
        .join('<br>');

    // Mostrar respostas
    const responsesDiv = document.getElementById('responses');
    responsesDiv.innerHTML = responses;
    responsesDiv.style.display = 'block';

    // Salvar respostas no Firebase
    saveResponsesToFirebase(responses);

    // Oculta o botão de Stop e mostra o botão de Reiniciar
    stopForm.querySelector('button[type="submit"]').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'block';
});

// Função para salvar respostas no Firebase
function saveResponsesToFirebase(responses) {
    const responsesRef = ref(db, 'respostas/' + Date.now()); // Usa timestamp como chave única
    set(responsesRef, {
        respostas: responses
    }).then(() => {
        console.log('Respostas salvas com sucesso!');
    }).catch((error) => {
        console.error('Erro ao salvar respostas: ', error);
    });
}

// Adicione um evento para o botão de reiniciar que atualiza a página
document.getElementById('restart-btn').addEventListener('click', () => {
    location.reload(); // Atualiza a página
});
