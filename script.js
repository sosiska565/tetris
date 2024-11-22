const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const ROW = 20;
const COL = 10;
const BLOCK_SIZE = 20;

let board = Array.from({ length: ROW }, () => Array(COL).fill(0));
let currentPiece;
let gameInterval;

const shapes = [
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1], [1, 1]],       // O
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
    [[1, 1, 1, 1]]          // I
];
function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < ROW; r++) {
        for (let c = 0; c < COL; c++) {
            if (board[r][c]) {
                context.fillStyle = 'cyan';
                context.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                context.strokeStyle = 'black';
                context.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function randomPiece() {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    return {
        shape,
        row: 0,
        col: Math.floor((COL - shape[0].length) / 2)
    };
}

function drawCurrentPiece() {
    const shape = currentPiece.shape;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                context.fillStyle = 'cyan';
                context.fillRect((currentPiece.col + c) * BLOCK_SIZE, (currentPiece.row + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                context.strokeStyle = 'black';
                context.strokeRect((currentPiece.col + c) * BLOCK_SIZE, (currentPiece.row + r) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function collide() {
    const shape = currentPiece.shape;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c] && (board[currentPiece.row + r] && board[currentPiece.row + r][currentPiece.col + c]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function merge() {
    const shape = currentPiece.shape;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                board[currentPiece.row + r][currentPiece.col + c] = 1;
            }
        }
    }
}
function removeFullRows() {
    board = board.filter(row => row.some(cell => cell === 0));
    while (board.length < ROW) {
        board.unshift(Array(COL).fill(0));
    }
}

function update() {
    currentPiece.row++;
    if (collide()) {
        currentPiece.row--;
        merge();
        removeFullRows();
        currentPiece = randomPiece();
        if (collide()) {
            clearInterval(gameInterval);
            alert('Игра окончена!');
        }
    }
    drawBoard();
    drawCurrentPiece();
}

function moveLeft() {
    currentPiece.col--;
    if (collide()) {
        currentPiece.col++;
    }
}

function moveRight() {
    currentPiece.col++;
    if (collide()) {
        currentPiece.col--;
    }
}

document.getElementById('start').addEventListener('click', () => {
    board = Array.from({ length: ROW }, () => Array(COL).fill(0));
    currentPiece = randomPiece();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(update, 1000);
});

document.getElementById('left').addEventListener('click', moveLeft);
document.getElementById('right').addEventListener('click', moveRight);

drawBoard();