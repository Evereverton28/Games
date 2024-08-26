document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("pongCanvas");
  const ctx = canvas.getContext("2d");
  const pauseButton = document.getElementById("pauseButton");
  const startButton = document.getElementById("startButton");

  let paused = false;
  let gameStarted = false;

  // Ball
  const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speedX: 5,
    speedY: 5,
    dx: 5,
    dy: 5
  };

  // Paddles
  const paddleHeight = 100;
  const paddleWidth = 10;
  const leftPaddle = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
  };
  const rightPaddle = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
  };

  // Scores
  let leftScore = 0;
  let rightScore = 0;

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff0"; // Glow effect for the ball
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle(paddle) {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = "#fff";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#0f0"; // Glow effect for the paddle
    ctx.fill();
    ctx.closePath();
  }

  function drawScores() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "#fff";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ff0"; // Glow effect for the score
    ctx.fillText(leftScore, canvas.width / 4, 50);
    ctx.fillText(rightScore, canvas.width * 0.75, 50);
  }

  function draw() {
    if (paused || !gameStarted) {
      return; // Skip drawing if paused or game not started
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw elements
    drawBall();
    drawPaddle(leftPaddle);
    drawPaddle(rightPaddle);
    drawScores();

    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
      animateBallBounce(); // Animation when hitting top/bottom
    }

    // Ball collision with paddles
    checkPaddleCollision(leftPaddle);
    checkPaddleCollision(rightPaddle);

    // Ball out of bounds
    if (ball.x + ball.radius > canvas.width) {
      leftScore++;
      animateScore(leftScore); // Animation for scoring
      resetBall();
    } else if (ball.x - ball.radius < 0) {
      rightScore++;
      animateScore(rightScore); // Animation for scoring
      resetBall();
    }

    // Move paddles
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;

    // Ensure paddles stay within canvas bounds
    leftPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, leftPaddle.y));
    rightPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddle.y));

    requestAnimationFrame(draw);
  }

  function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
    ball.dy = Math.random() < 0.5 ? -5 : 5;
    ctx.shadowBlur = 0; // Remove shadow effect when resetting the ball
  }

  function checkPaddleCollision(paddle) {
    if (
      ball.x + ball.radius > paddle.x &&
      ball.x - ball.radius < paddle.x + paddle.width &&
      ball.y + ball.radius > paddle.y &&
      ball.y - ball.radius < paddle.y + paddle.height
    ) {
      ball.dx = -ball.dx;
      animatePaddleHit(paddle); // Animation when hitting paddle
    }
  }

  function animateBallBounce() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#f00";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#f00"; // Red glow effect on bounce
    ctx.fill();
    ctx.closePath();
    setTimeout(() => ctx.shadowBlur = 0, 100); // Reset shadow after animation
  }

  function animatePaddleHit(paddle) {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = "#0f0";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#0f0"; // Green glow effect on hit
    ctx.fill();
    ctx.closePath();
    setTimeout(() => ctx.shadowBlur = 0, 100); // Reset shadow after animation
  }

  function animateScore(score) {
    ctx.font = "40px Arial";
    ctx.fillStyle = "#ff0";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ff0"; // Yellow glow effect on score
    ctx.fillText(score, canvas.width / 4, 50);
    setTimeout(() => ctx.shadowBlur = 0, 500); // Reset shadow after animation
  }

  // Start button functionality
  startButton.addEventListener("click", function() {
    if (!gameStarted) {
      gameStarted = true;
      startButton.style.display = 'none'; // Hide start button
      pauseButton.style.display = 'block'; // Show pause button
      draw(); // Start the game
    }
  });

  // Pause button functionality
  pauseButton.addEventListener("click", function() {
    paused = !paused;
    pauseButton.textContent = paused ? "Resume" : "Pause";

    if (!paused) {
      draw(); // Resume the game
    }
  });

  document.addEventListener("keydown", function(e) {
    if (e.key === "ArrowUp" && rightPaddle.y > 0) {
      rightPaddle.dy = -5;
    } else if (e.key === "ArrowDown" && rightPaddle.y + rightPaddle.height < canvas.height) {
      rightPaddle.dy = 5;
    } else if (e.key === "w" && leftPaddle.y > 0) {
      leftPaddle.dy = -5;
    } else if (e.key === "s" && leftPaddle.y + leftPaddle.height < canvas.height) {
      leftPaddle.dy = 5;
    }
  });

  document.addEventListener("keyup", function(e) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      rightPaddle.dy = 0;
    } else if (e.key === "w" || e.key === "s") {
      leftPaddle.dy = 0;
    }
  });
});
