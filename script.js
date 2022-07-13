// Canvas
const { body } = document;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext("2d");

const width = 500;
const height = 700;
const screenWidth = window.screen.width;
const canvasPosition = screenWidth / 2 - width / 2;
const isMobile = window.matchMedia('(max-width: 600px)');
const gameOverEl = document.createElement('div');

// Paddle
const paddleHeight = 10;
const paddleWidth = 50;
const paddleDiff = 25;
//the paddel is set t0 225 on X Axis because the container is 500px and the paddle itself is 50px so to centrelize it we type 225
let paddleBottomX = 225;
let paddleTopX = 225;
let isplayerMoved = false;
let paddleContact = false;

// Ball
let ballX = 250;
let ballY = 350;
const ballRadius = 5;

// Speed
let speedY;
let speedX;
let trajectoryX;
let computerSpeed;

// Change Mobile Settings
if(isMobile.matches) {
  speedY = -2;
  speedX = speedY;
  computerSpeed = 4;
} else {
  speedY = -1;
  speedX = speedY;
  computerSpeed = 3;
}

// Score
let playerScore = 0;
let computerScore = 0;
const winningScore = 5;
let isGameOver = true;
let isNewGame = true;

// Render Everything on Canvas
function renderCanvas() {
  // Canvas Background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);

  // Paddle Color
  ctx.fillStyle = '#fff';

  // Player Paddle (Bottom)
  ctx.fillRect(paddleBottomX, height - 20, paddleWidth, paddleHeight);

  // Computer Paddle (Top)
  ctx.fillRect(paddleTopX, 10, paddleWidth, paddleHeight);

  // Dashed Center Line
  ctx.beginPath();
  ctx.setLineDash([8]);
  //the hieght of our canvas is 700px so 350 to make the line in the middle
  ctx.moveTo(0, 350);
  ctx.lineTo(500, 350);
  ctx.strokeStyle = 'grey';
  ctx.stroke();

  // Ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 2 * Math.PI, false);
  ctx.fillStyle = '#fff';
  ctx.fill();

  // Score
  ctx.font = '32px Courier N ew';
  ctx.fillText(playerScore, 20, canvas.height / 2 + 50);
  ctx.fillText(computerScore, 20, canvas.height / 2 - 30);
}

// Create Canvas Element
function createCanvas() {
  canvas.width = width;
  canvas.height = height;
  body.appendChild(canvas);
  renderCanvas();
}

// Remove this
createCanvas();

// Reset Ball to Center
function ballReset() {
  ballX = width / 2;
  ballY = height / 2;
  speedY = -3;
  paddleContact = false;
}

// Adjust Ball Movement and speed
function ballMove() {
  // Vertical Speed
  ballY += -speedY;
  // Horizontal Speed
  if(isplayerMoved && paddleContact) {
    ballX += speedX;
  }
}

// Determine What Ball Bounces Off, Score Points, Reset Ball
function ballBoundaries() {
  // Bounce off Left Wall
  if(ballX < 0 && speedX < 0) {
    speedX = -speedX;
  }
  // Bounce off Right Wall
  if(ballX > width && speedX > 0) {
    speedX = -speedX;
  }
  // Bounce off player paddle (bottom)
  if(ballY > height - paddleDiff) {
    if(ballX > paddleBottomX && ballX < paddleBottomX + paddleWidth) {
      paddleContact = true;
      // Add Speed on Hit
      if(isplayerMoved) {
        speedY -= 1;
        // Max Speed
        if(speedY < -5) {
          speedY = -5;
          computerSpeed = 6;
        }
      }
      speedY = -speedY;
      trajectoryX = ballX - (paddleBottomX + paddleDiff);
      speedX = trajectoryX * 0.3;
    } else if(ballY > height) {
      // Reset Ball, add to Computer Score
      ballReset();
      computerScore++;
    }
  }
  // Bounce off computer paddle (top)
  if(ballY < paddleDiff) {
    if(ballX > paddleTopX && ballX < paddleTopX + paddleWidth) {
      // Add Speed on Hit
      if(isplayerMoved) {
        speedY += 1;
        // Max Speed
        if(speedY > 5) {
          speedY = 5;
        }
      }
      speedY = -speedY;
    } else if(ballY < 0) {
      // Reset Ball, add to Player Score
      ballReset();
      playerScore++;
    }
  }
}

// Computer Movement Adjusted to move a bit slower than the ball
function computerAI() {
  if(isplayerMoved) {
    if(paddleTopX + paddleDiff < ballX) {
      paddleTopX += computerSpeed;
    } else {
      paddleTopX -= computerSpeed;
    }
  }
}

function showGameOverEl(winner) {
  // Hide Canvas
  canvas.hidden = true;
  // Container
  gameOverEl.textContent = '';
  gameOverEl.classList.add('game-over-container');
  // Title
  const title = document.createElement('h1');
  title.textContent = `${winner} Wins!`;
  // Button
  const playAgainBtn = document.createElement('button');
  playAgainBtn.setAttribute('onclick', 'startGame()');
  playAgainBtn.textContent = 'Play Again';
  // Append
  gameOverEl.append(title, playAgainBtn);
  body.appendChild(gameOverEl);

}

// Check If One Player Has Winning Score, If They Do, End Game
function gameOver() {
  if(playerScore === winningScore || computerScore === winningScore) {
    isGameOver = true;
    // Set Winner
    let winner = playerScore === winningScore ? "Player 1" : "Computer";
    showGameOverEl(winner);
  }
}

// rerender the frame on every move
function animate() {
  renderCanvas();
  ballMove();
  ballBoundaries();
  computerAI();
  gameOver();
  if(!isGameOver) {
    window.requestAnimationFrame(animate);
  }
}

// Start Game, Reset Everything
function startGame() {
  //this will run only when the game is over and we are trying to start a new game
  if(isGameOver && !isNewGame) {
    body.removeChild(gameOverEl);
    canvas.hidden = false;
  }
  isGameOver = false;
  isNewGame = false;
  playerScore = 0;
  computerScore = 0;
  ballReset();
  createCanvas();
  //start the animation
  animate();
  canvas.addEventListener('mousemove', (e) => {
    console.log("1====>e.clientX", e.clientX);
    //
    isplayerMoved = true;
    // making sure the canvas staying centered and the paddles not going outside the canvas
    paddleBottomX = e.clientX - canvasPosition - paddleDiff;
    if(paddleBottomX < paddleDiff) {
      paddleBottomX = 0;
    }
    if(paddleBottomX > width - paddleWidth) {
      paddleBottomX = width - paddleWidth;
    }
    // Hide Cursor
    canvas.style.cursor = 'none';
  });
}

// On Load
startGame();
