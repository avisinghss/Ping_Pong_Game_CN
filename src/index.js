import "./styles.css";

// document.getElementById("app").innerHTML = ``;

// JavaScript code for the ping pong game

// Get the elements
const container = document.querySelector(".container");
const rod1 = document.querySelector(".rod1");
const rod2 = document.querySelector(".rod2");
const ball = document.querySelector(".ball");
const player1Score = document.querySelector(".player_1_Score");
const player2Score = document.querySelector(".player_2_Score");
const message = document.querySelector(".message");

// Game variables
let rod1X = 0;
let rod2X = 0;
let ballX = 1;
let ballY = 1;
let ballSpeedX = 2; // Ball speed in X direction
let ballSpeedY = 2; // Ball speed in Y direction
let score1 = 0;
let score2 = 0;
let isPlaying = false;
let highestScore = 0;
let highestScorer = "";

// Load highest score from local storage
let localStorageAvailable = true;
try {
  if (localStorage.getItem("highestScore")) {
    highestScore = parseInt(localStorage.getItem("highestScore"));
    highestScorer = localStorage.getItem("highestScorer");
    message.textContent = `Highest Score: ${highestScore} by ${highestScorer}`;
  } else {
    message.textContent = "This is your first time.";
  }
} catch (error) {
  // localStorage is not available
  localStorageAvailable = false;
}

// Move the rods
document.addEventListener("keydown", (event) => {
  if (!isPlaying) return;

  if (event.key === "ArrowLeft" || event.key === "a") {
    if (rod1X > 0) {
      rod1X -= 10;
    }
    if (rod2X > 0) {
      rod2X -= 10;
    }
  } else if (event.key === "ArrowRight" || event.key === "d") {
    if (rod1X < container.offsetWidth - rod1.offsetWidth) {
      rod1X += 10;
    }
    if (rod2X < container.offsetWidth - rod2.offsetWidth) {
      rod2X += 10;
    }
  }
});

// Game loop
function gameLoop() {
  if (!isPlaying) {
    message.textContent = "Press Enter to Play.";
    return;
  }

  // Move the ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Check collision with rods
  if (ballY + ball.offsetHeight >= container.offsetHeight - rod2.offsetHeight) {
    if (ballX >= rod2X && ballX <= rod2X + rod2.offsetWidth) {
      ballSpeedY = -ballSpeedY; // Reverse the Y direction
    } else {
      score1++;
      player1Score.textContent = score1;
      resetBall();
      checkGameOver();
    }
  } else if (ballY <= rod1.offsetHeight) {
    if (ballX >= rod1X && ballX <= rod1X + rod1.offsetWidth) {
      ballSpeedY = -ballSpeedY; // Reverse the Y direction
    } else {
      score2++;
      player2Score.textContent = score2;
      resetBall();
      checkGameOver();
    }
  }

  // Check collision with side walls
  if (ballX >= container.offsetWidth - ball.offsetWidth || ballX <= 0) {
    ballSpeedX = -ballSpeedX; // Reverse the X direction
  }

  // Move the rods
  rod1.style.left = `${rod1X}px`;
  rod2.style.left = `${rod2X}px`;

  // Move the ball
  ball.style.left = `${ballX}px`;
  ball.style.top = `${ballY}px`;

  requestAnimationFrame(gameLoop);
}

// Reset the ball position
function resetBall() {
  ballX = container.offsetWidth / 2;
  ballY = container.offsetHeight / 2;
  rod1X = 0;
  rod2X = 0;
  rod1.style.left = `${rod1X}px`;
  rod2.style.left = `${rod2X}px`;
}

// Check if the game is over
function checkGameOver() {
  const winningScore = 5; // Change this value to set the winning score

  if (score1 === winningScore) {
    endGame("Player 1", score1);
    alert(`Player 1 Wins with Score: ${score1}`);
  } else if (score2 === winningScore) {
    endGame("Player 2", score2);
    alert(`Player 2 Wins with Score: ${score2}`);
  }
}

// Start the game
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (isPlaying) return;

    isPlaying = true;
    score1 = 0;
    score2 = 0;
    player1Score.textContent = score1;
    player2Score.textContent = score2;
    message.textContent = "Game Started";
    resetBall();
    gameLoop();
  }
});

// End the game
function endGame(winner, score) {
  isPlaying = false;
  if (localStorageAvailable) {
    if (score > highestScore) {
      highestScore = score;
      highestScorer = winner;
      localStorage.setItem("highestScore", highestScore.toString());
      localStorage.setItem("highestScorer", highestScorer);
      message.textContent = `New Highest Score: ${highestScore} by ${highestScorer}`;
    } else {
      message.textContent = `Winner: ${winner} with Score: ${score}`;
    }
  } else {
    message.textContent = `Winner: ${winner} with Score: ${score}`;
  }
}
