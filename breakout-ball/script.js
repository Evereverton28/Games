// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const wall = 10;
const PADDLE_W = 0.2; // Width of the paddle as a percentage of canvas width
const PADDLE_SPD = 10;
const BALL_SPD = 5;
const GAME_LIVES = 3;

let bricks = [];
let ball, paddle;
let score = 0, scoreHigh = 0, lives = GAME_LIVES;
let gameOver = false, win = false;
let isPaused = false; // Variable to track the pause state

// Create the ball
function createBall() {
    ball = {
        x: canvas.width / 2,
        y: canvas.height - 30,
        radius: 10,
        dx: BALL_SPD * (Math.random() < 0.5 ? 1 : -1),
        dy: -BALL_SPD,
    };
}

// Create the paddle
function createPaddle() {
    paddle = {
        x: (canvas.width - canvas.width * PADDLE_W) / 2,
        y: canvas.height - 20,
        width: canvas.width * PADDLE_W,
        height: 10,
        dx: 0,
    };
}

// Create bricks
function createBricks() {
    const rowCount = 5;
    const columnCount = 7;
    const brickWidth = (canvas.width - wall * (columnCount + 1)) / columnCount;
    const brickHeight = 20;

    for (let c = 0; c < columnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < rowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    for (let c = 0; c < columnCount; c++) {
        for (let r = 0; r < rowCount; r++) {
            bricks[c][r].x = c * (brickWidth + wall) + wall;
            bricks[c][r].y = r * (brickHeight + wall) + wall;
        }
    }
}

// Function to resize the canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createPaddle(); // Recreate the paddle
    createBricks(); // Recreate bricks
}

// Event listener for window resize
window.addEventListener('resize', resizeCanvas);

// Draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

// Draw the paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

// Draw bricks
function drawBricks() {
    for (let c = 0; c < bricks.length; c++) {
        for (let r = 0; r < bricks[c].length; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = bricks[c][r].x;
                const brickY = bricks[c][r].y;
                const brickWidth = (canvas.width - wall * (bricks.length + 1)) / bricks.length;
                const brickHeight = 20;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Collision detection
function collisionDetection() {
    for (let c = 0; c < bricks.length; c++) {
        for (let r = 0; r < bricks[c].length; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (ball.x > b.x && ball.x < b.x + (canvas.width - wall * (bricks.length + 1)) / bricks.length && ball.y > b.y && ball.y < b.y + 20) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    score++;
                    if (score > scoreHigh) scoreHigh = score;
                    if (score === bricks.length * bricks[0].length) {
                        win = true;
                    }
                }
            }
        }
    }
}

// Update game state
function update() {
    if (gameOver || win || isPaused) return; // Stop updating if game is over or paused

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with walls
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
    if (ball.y + ball.radius > canvas.height) {
        lives--;
        if (!lives) {
            gameOver = true;
        } else {
            createBall();
        }
    }

    // Paddle collision
    if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        ball.dy = -ball.dy;
    }

    // Move paddle
    paddle.x += paddle.dx;

    // Prevent paddle from going out of bounds
    if (paddle.x < 0) {
        paddle.x = 0;
    } else if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
    }

    collisionDetection();
}

// Draw game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();

    // Draw score and lives
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, 8, 20);
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);

    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over!', canvas.width / 2 - 70, canvas.height / 2);
    }

    if (win) {
        ctx.fillStyle = 'green';
        ctx.font = '30px Arial';
        ctx.fillText('You Win!', canvas.width / 2 - 60, canvas.height / 2);
    }
}

// Control paddle movement and pause toggle
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        paddle.dx = PADDLE_SPD;
    } else if (e.key === 'ArrowLeft') {
        paddle.dx = -PADDLE_SPD;
    } else if (e.key === 'p' || e.key === 'P') {
        togglePause(); // Toggle pause on 'P' key press
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        paddle.dx = 0;
    }
});

// Function to toggle pause
function togglePause() {
    isPaused = !isPaused;
}

// Main game loop
function main() {
    if (!gameOver && !win && !isPaused) {
        update();
        draw();
    }
    requestAnimationFrame(main);
}

// Initialize the game
function newGame() {
    score = 0;
    lives = GAME_LIVES;
    gameOver = false;
    win = false;
    createBricks();
    createBall();
    createPaddle();
}

// Start a new game
newGame();
main();
