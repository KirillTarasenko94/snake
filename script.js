
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const blockSize = 10;
const width = canvas.width / blockSize;
const height = canvas.height / blockSize;
const headImg = new Image();
headImg.src = "img/snake.png"; // Snake head image
const bodyColor = "green"; // color snake
const appleImg = new Image();
appleImg.src = "img/apple.png"; // image apple

let snake = [{ x: Math.floor(width / 2), y: Math.floor(height / 2) }];
let fruit = {
  x: Math.floor(Math.random() * width),
  y: Math.floor(Math.random() * height),
};
let direction = "right";
let score = 0;
let speed = 200; // Reduced initial speed
let gameInterval;
let musicEnabled = true;
const backgroundMusic = document.getElementById("backgroundMusic");
const gameOverMusic = document.getElementById("gameOverMusic");

function toggleMusic() {
  if (musicEnabled) {
    backgroundMusic.pause();
    gameOverMusic.pause();
    musicEnabled = false;
  } else {
    backgroundMusic.play();
    musicEnabled = true;
  }
}

function gameOver() {
  clearInterval(gameInterval); // Stopping the game interval
  document.getElementById("gameOver").style.display = "block"; // Showing the game over message
  backgroundMusic.pause(); // Pausing the background music playback
  gameOverMusic.play(); // Playing the music for the gameOver state
}

function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the background grid
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? "#D3D3D3" : "#A9A9A9";
      ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    }
  }

  // Draw the fruit
  ctx.drawImage(
    appleImg,
    fruit.x * blockSize,
    fruit.y * blockSize,
    blockSize * 2,
    blockSize * 2
  );

  // Draw the snake's body
  ctx.fillStyle = bodyColor;
  snake.slice(1).forEach((segment) => {
    ctx.fillRect(
      segment.x * blockSize,
      segment.y * blockSize,
      blockSize,
      blockSize
    );
  });

  // Draw the snake's head
  ctx.drawImage(
    headImg,
    snake[0].x * blockSize,
    snake[0].y * blockSize,
    blockSize * 2,
    blockSize * 2
  );

  // Draw the score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, canvas.height + 25);
}

function move() {
  const head = { ...snake[0] };

  // Move the snake
  if (direction === "up") head.y--;
  if (direction === "down") head.y++;
  if (direction === "left") head.x--;
  if (direction === "right") head.x++;

  // Check if the snake eats the fruit
  if (head.x === fruit.x && head.y === fruit.y) {
    score++;
    document.getElementById("score").textContent = "Score: " + score;
    fruit = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    };
    speed -= 5; // Decrease speed
  } else {
    snake.pop(); // Remove the last segment
}

// Check if the player wins
if (score >= 1000) {
    clearInterval(gameInterval); // Stop the game interval
    document.getElementById("gameOver").textContent = "You win!";
    document.getElementById("gameOver").style.display = "block"; // Show the win message
    stopMusic(); // Stop the music
    return;
}

// Check if the game ends
if (
    head.x < 0 ||
    head.x >= width ||
    head.y < 0 ||
    head.y >= height ||
    collision(head)
) {
    clearInterval(gameInterval); // Stop the game interval
    document.getElementById("gameOver").style.display = "block"; // Show the loss message
    stopMusic(); // Stop the music
    return;
}

snake.unshift(head);
draw();
clearInterval(gameInterval);
gameInterval = setInterval(move, speed); // Set a new game interval with updated speed
}

function collision(head) {
  return snake
    .slice(1)
    .some((segment) => segment.x === head.x && segment.y === head.y);
}

function startGame() {
  backgroundMusic.play();
  gameInterval = setInterval(move, speed); // Start the game interval
}
function stopMusic() {
  backgroundMusic.pause(); // Pause the music
  gameOverMusic.play();
}

function restartGame() {
  backgroundMusic.pause();
  clearInterval(gameInterval); // Stop the game interval
  snake = [{ x: Math.floor(width / 2), y: Math.floor(height / 2) }];
  fruit = {
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height),
  };
  direction = "right";
  score = 0;
  speed = 200; // Reset speed to initial value
  document.getElementById("score").textContent = "Score: " + score;
  document.getElementById("gameOver").style.display = "none"; // Hide the loss message
  draw();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "down") direction = "up";
  if (e.key === "ArrowDown" && direction !== "up") direction = "down";
  if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
  if (e.key === "ArrowRight" && direction !== "left") direction = "right";
});
