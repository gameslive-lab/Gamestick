// Variáveis do jogo
let palavraSecreta = "";  // Palavra inserida pelo jogador 1
let palavraOculta = "";
let tentativasErradas = 0;
const maxTentativas = 6;
let letrasErradas = [];
let letrasCorretas = [];

// Referências aos elementos da interface
const palavraOcultaDiv = document.getElementById("palavra-oculta");
const inputLetra = document.getElementById("input-letra");
const botaoTentar = document.getElementById("botao-tentar");
const letrasErradasDiv = document.getElementById("letras-erradas");
const imagemForca = document.getElementById("imagem-forca");
const inserirPalavraContainer = document.getElementById("inserir-palavra-container");
const jogoContainer = document.getElementById("jogo-container");
const inputPalavraSecreta = document.getElementById("input-palavra-secreta");
const botaoComecar = document.getElementById("botao-comecar");

// Função para atualizar a palavra oculta na tela
function atualizarPalavraOculta() {
    palavraOcultaDiv.textContent = letrasCorretas.join(" ");
}

// Função para atualizar a imagem da forca
function atualizarImagemForca(tentativas) {
    imagemForca.src = `img/forca${tentativas}.png`;
}

// Lógica para tentar adivinhar uma letra
function tentarLetra() {
    const letra = inputLetra.value.toUpperCase();
    inputLetra.value = ""; // Limpa o campo de input

    if (!letra || letrasErradas.includes(letra) || letrasCorretas.includes(letra)) {
        return; // Ignora se já tentou a letra ou se a letra é inválida
    }

    if (palavraSecreta.includes(letra)) {
        // Revelar a letra correta na palavra oculta
        for (let i = 0; i < palavraSecreta.length; i++) {
            if (palavraSecreta[i] === letra) {
                letrasCorretas[i] = letra;
            }
        }
        atualizarPalavraOculta();

        // Verifica se o jogador venceu
        if (!letrasCorretas.includes("_")) {
            alert("Parabéns! Você venceu!");
            resetarJogo();
        }
    } else {
        // Adiciona a letra às erradas e atualiza a imagem da forca
        letrasErradas.push(letra);
        tentativasErradas++;
        atualizarImagemForca(tentativasErradas);
        letrasErradasDiv.textContent = `Letras erradas: ${letrasErradas.join(", ")}`;

        // Verifica se o jogador perdeu
        if (tentativasErradas >= maxTentativas) {
            alert(`Você perdeu! A palavra era: ${palavraSecreta}`);
            resetarJogo();
        }
    }
}

// Resetar o jogo para jogar novamente
function resetarJogo() {
    palavraOculta = "";
    tentativasErradas = 0;
    letrasErradas = [];
    letrasCorretas = Array(palavraSecreta.length).fill("_");
    atualizarPalavraOculta();
    letrasErradasDiv.textContent = "Letras erradas: ";
    atualizarImagemForca(tentativasErradas);
    inputLetra.focus();
}

// Evento para começar o jogo após inserir a palavra
botaoComecar.addEventListener("click", function() {
    palavraSecreta = inputPalavraSecreta.value.toUpperCase();
    if (palavraSecreta.length > 0) {
        letrasCorretas = Array(palavraSecreta.length).fill("_");
        atualizarPalavraOculta();
        inserirPalavraContainer.style.display = "none";  // Esconde o campo de inserção da palavra
        jogoContainer.style.display = "block";  // Mostra o jogo da forca
        inputLetra.focus();
    }
});

// Eventos para tentar uma letra
botaoTentar.addEventListener("click", tentarLetra);
inputLetra.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        tentarLetra();
    }
});

// Inicializar a tela inicial
atualizarImagemForca(tentativasErradas);
