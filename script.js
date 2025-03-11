const wordsArray = ["PINGUIM", "AMOR", "PRINCESA"];
const correctCode = "2023";
const gridSize = 10;
const grid = document.getElementById("grid");
const codeInput = document.getElementById("codeInput");
const startButton = document.getElementById("startButton");
const gameContainer = document.getElementById("gameContainer");
const codeScreen = document.getElementById("codeScreen");
const codeMessage = document.getElementById("codeMessage");
const victoryMessage = document.getElementById("victoryMessage");

let letterGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
let selectedLetters = [];
let foundWords = new Set();

// **Validação do Código**
startButton.addEventListener("click", () => {
    if (codeInput.value.trim() === correctCode) {
        codeScreen.classList.add("hidden");
        gameContainer.classList.remove("hidden");
        generateGrid();
    } else {
        codeMessage.textContent = "Código incorreto! Tente novamente.";
        codeMessage.style.color = "red";
    }
});

// **Gerar a grade de jogo**
function generateGrid() {
    grid.innerHTML = "";  // Limpar a grid antes de gerar novamente
    letterGrid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));

    placeWords();  // Posiciona as palavras
    fillEmptySpaces();  // Preenche o resto da grade com letras aleatórias

    // Renderiza a grid na tela
    letterGrid.forEach((row, rowIndex) => {
        row.forEach((letter, colIndex) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;
            cell.textContent = letter;
            cell.addEventListener("click", handleLetterClick);
            grid.appendChild(cell);
        });
    });
}

// **Posicionar palavras aleatoriamente na horizontal ou vertical**
function placeWords() {
    wordsArray.forEach(word => {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 100) {
            const direction = Math.random() < 0.5 ? "HORIZONTAL" : "VERTICAL";
            let row, col;

            if (direction === "HORIZONTAL") {
                row = Math.floor(Math.random() * gridSize);
                col = Math.floor(Math.random() * (gridSize - word.length + 1));
            } else {
                row = Math.floor(Math.random() * (gridSize - word.length + 1));
                col = Math.floor(Math.random() * gridSize);
            }

            if (canPlaceWord(word, row, col, direction)) {
                for (let i = 0; i < word.length; i++) {
                    if (direction === "HORIZONTAL") {
                        letterGrid[row][col + i] = word[i];
                    } else {
                        letterGrid[row + i][col] = word[i];
                    }
                }
                placed = true;
            }
            attempts++;
        }

        if (!placed) {
            console.warn(`⚠ Não foi possível posicionar a palavra: ${word}`);
        }
    });
}

// **Verifica se uma palavra pode ser colocada sem colisão e dentro dos limites**
function canPlaceWord(word, row, col, direction) {
    for (let i = 0; i < word.length; i++) {
        if (direction === "HORIZONTAL") {
            if (col + i >= gridSize || letterGrid[row][col + i] !== '') {
                return false;
            }
        }
        if (direction === "VERTICAL") {
            if (row + i >= gridSize || letterGrid[row + i][col] !== '') {
                return false;
            }
        }
    }
    return true;
}

// **Preencher os espaços vazios**
function fillEmptySpaces() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (letterGrid[row][col] === '') {
                letterGrid[row][col] = alphabet[Math.floor(Math.random() * alphabet.length)];
            }
        }
    }
}

// **Lógica de seleção das letras**
function handleLetterClick(event) {
    const cell = event.target;
    cell.classList.add("selected");
    selectedLetters.push(cell.textContent);

    let currentWord = selectedLetters.join("");

    if (wordsArray.includes(currentWord)) {
        foundWords.add(currentWord);
        selectedLetters = []; // Resetar seleção
        checkVictory();
    } else if (!wordsArray.some(word => word.startsWith(currentWord))) {
        selectedLetters = []; // Resetar se for uma palavra errada
        document.querySelectorAll(".selected").forEach(cell => cell.classList.remove("selected"));
    }
}

// **Verifica se todas as palavras foram encontradas**
function checkVictory() {
    if (foundWords.size === wordsArray.length) {
        victoryMessage.classList.remove("hidden");
    }
}

