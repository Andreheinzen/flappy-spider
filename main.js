
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu');
const usernameInput = document.getElementById('usernameInput');
const startButton = document.getElementById('startButton');
const gameOverScreen = document.getElementById('gameOverScreen');
const scoreDisplay = document.getElementById('scoreDisplay');
const restartButton = document.getElementById('restartButton');
const gameOverMessage = document.getElementById('gameOverMessage');

let isGameActive = false;
let score = 0;
let username = '';
let gameLoop;

// Propriedades do jogo
const gravity = 0.5;
const jumpStrength = -8;
const pipeSpeed = 2;
const pipeWidth = 60;
const pipeGap = 200;

// Objeto da Aranha
let spider = {
    x: 100,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    velocityY: 0,
    // Pixel art simples para a aranha (1s representam pixels)
    pixels: [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0]
    ]
};

// Array para as colunas
let pipes = [];

// Funções de desenho
function drawSpider() {
    const pixelSize = spider.width / spider.pixels[0].length;
    ctx.fillStyle = '#4B0082'; // Cor roxa escura para a aranha

    for (let r = 0; r < spider.pixels.length; r++) {
        for (let c = 0; c < spider.pixels[r].length; c++) {
            if (spider.pixels[r][c] === 1) {
                ctx.fillRect(
                    spider.x + c * pixelSize,
                    spider.y + r * pixelSize,
                    pixelSize,
                    pixelSize
                );
            }
        }
    }
}

function drawPipes() {
    ctx.fillStyle = '#008000'; // Verde escuro para os canos
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
    });
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '40px "Press Start 2P", cursive';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.strokeText(score, canvas.width / 2, 60);
    ctx.fillText(score, canvas.width / 2, 60);
}

// Funções de lógica do jogo
function update() {
    if (!isGameActive) return;

    // Lógica da aranha
    spider.velocityY += gravity;
    spider.y += spider.velocityY;

    // Lógica das colunas
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;
    });

    // Remove colunas que saíram da tela e adiciona novas
    if (pipes.length > 0 && pipes[0].x < -pipeWidth) {
        pipes.shift();
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 250) {
        let topHeight = Math.random() * (canvas.height - 300) + 50;
        pipes.push({
            x: canvas.width,
            topHeight: topHeight,
            bottomY: topHeight + pipeGap,
            passed: false
        });
    }

    // Detecção de colisão e pontuação
    if (checkCollision()) {
        endGame();
        return;
    }

    pipes.forEach(pipe => {
        if (!pipe.passed && spider.x > pipe.x + pipeWidth) {
            pipe.passed = true;
            score++;
        }
    });

    // Limpa a tela e redesenha
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPipes();
    drawSpider();
    drawScore();
}

function checkCollision() {
    // Colisão com o chão e o teto
    if (spider.y + spider.height > canvas.height || spider.y < 0) {
        return true;
    }

    // Colisão com as colunas
    for (let pipe of pipes) {
        if (
            spider.x < pipe.x + pipeWidth &&
            spider.x + spider.width > pipe.x &&
            (spider.y < pipe.topHeight || spider.y + spider.height > pipe.bottomY)
        ) {
            return true;
        }
    }
    return false;
}

function startGame() {
    username = usernameInput.value.trim();
    if (username === '') {
        alert('Por favor, digite seu nome de usuário!');
        return;
    }

    isGameActive = true;
    score = 0;
    pipes = [];
    spider.y = canvas.height / 2;
    spider.velocityY = 0;

    menu.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameLoop = setInterval(update, 1000 / 60); // 60 FPS
}

function endGame() {
    isGameActive = false;
    clearInterval(gameLoop);
    gameOverMessage.textContent = `Fim de Jogo, ${username}!`;
    scoreDisplay.textContent = score;
    gameOverScreen.style.display = 'block';
}

function restartGame() {
    gameOverScreen.style.display = 'none';
    startGame();
}

// Eventos
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && isGameActive) {
        spider.velocityY = jumpStrength;
    }
});

// Exibe o menu inicial
window.onload = () => {
    menu.style.display = 'block';
};