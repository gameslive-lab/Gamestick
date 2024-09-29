let words = [];

// Função para carregar as palavras do arquivo
function loadWords() {
    fetch('palavras.txt')
        .then(response => response.text())
        .then(data => {
            words = data.split('\n').map(word => word.trim()).filter(word => word.length > 0);
        })
        .catch(error => console.error('Erro ao carregar palavras:', error));
}

document.getElementById("generateWord").addEventListener("click", function() {
    if (words.length === 0) {
        alert("As palavras ainda não foram carregadas. Tente novamente.");
        return;
    }

    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];

    const wordDisplay = document.getElementById("wordDisplay");
    const button = document.getElementById("generateWord");

    wordDisplay.textContent = randomWord;
    wordDisplay.style.display = "block";  
    setTimeout(() => {
        wordDisplay.classList.add('show');
    }, 100);

    button.style.display = "none";  
});

// Carregar as palavras do arquivo quando a página for carregada
window.onload = loadWords;
