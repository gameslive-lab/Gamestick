// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

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
	generateLetterButton.disabled = true;
});

// Função para gerar uma letra aleatória e armazená-la no Firebase
function randomizeLetter() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    const randomLetter = alphabet[randomIndex];
    letterDisplay.innerText = randomLetter;

    // Atualizar a letra no Firebase
    updateLetterInFirebase(randomLetter);
}

// Função para atualizar a letra no Firebase em um caminho fixo
function updateLetterInFirebase(letter) {
    const letterRef = ref(db, 'letra/atual'); // Caminho fixo para a letra
    set(letterRef, {
        letra: letter
    }).then(() => {
        console.log('Letra atualizada com sucesso!');
    }).catch((error) => {
        console.error('Erro ao atualizar a letra: ', error);
    });
}

// Função para escutar mudanças na letra armazenada e atualizar a interface
function listenForLetterUpdates() {
    const letterRef = ref(db, 'letra/atual'); // Mesma referência fixa

    onValue(letterRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.letra) {
            letterDisplay.innerText = data.letra; // Atualiza a letra na interface
            
            // Inicia o timer de 3 segundos se a letra for diferente de "STOP"
            if (data.letra !== 'STOP') {
                startTimer(3);
            } else {
                // Se a letra for "STOP", chamamos a lógica do botão Stop
                handleStop();
            }
        }
    });
}

// Função que simula o comportamento do botão Stop
function handleStop() {
    // Salvar a letra "STOP" no Firebase
    const letterRef = ref(db, 'letra/atual');
    set(letterRef, {
        letra: 'STOP'
    }).then(() => {
        console.log('Palavra STOP salva com sucesso!');
        letterDisplay.innerText = 'STOP'; // Muda a letra exibida para "STOP"
    }).catch((error) => {
        console.error('Erro ao salvar a palavra STOP: ', error);
    });

    const responses = Array.from(stopForm.querySelectorAll('input'))
        .map(input => `<div class="response-item">${input.placeholder}: ${input.value || "Não preenchido"}</div>`)
        .join(''); // Modificado para incluir a classe
		
		disableInputs(true) //disabilitar os inputs
		
    // Mostrar respostas
    const responsesDiv = document.getElementById('responses');
    responsesDiv.innerHTML = responses;
    responsesDiv.style.display = 'block';

    // Oculta o botão de Stop e mostra o botão de Reiniciar
    stopForm.querySelector('button[type="submit"]').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'block';
}

// Chamar a função para começar a escutar atualizações da letra
listenForLetterUpdates();

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
// Função para limpar a letra no Firebase
function clearFirebaseLetter() {
    const letterRef = ref(db, 'letra/atual');
    set(letterRef, {
        letra: '' // Limpa a letra armazenada
    }).then(() => {
        console.log('Letra apagada no Firebase com sucesso!');
    }).catch((error) => {
        console.error('Erro ao apagar a letra: ', error);
    });
}

// Lógica para resetar o jogo
stopForm.addEventListener('submit', (e) => {
    e.preventDefault();
	updateLetterInFirebase("STOP");
    // Coletar respostas
    const responses = Array.from(stopForm.querySelectorAll('input'))
        .map(input => `<div class="response-item">${input.placeholder}: ${input.value || "Não preenchido"}</div>`)
        .join(''); // Modificado para incluir a classe

    // Mostrar respostas
    const responsesDiv = document.getElementById('responses');
    responsesDiv.innerHTML = responses;
    responsesDiv.style.display = 'block';

    // Oculta o botão de Stop e mostra o botão de Reiniciar
    stopForm.querySelector('button[type="submit"]').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'block';
	
});

// Adicione um evento para o botão de reiniciar que atualiza a página
document.getElementById('restart-btn').addEventListener('click', () => {
	clearFirebaseLetter(); // Adicione esta linha
    location.reload(); // Atualiza a página
});
