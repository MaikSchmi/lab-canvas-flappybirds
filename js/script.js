// Game Vars
let gameOver = false;
let gameFrames = 0;
let score = 0;
let justScored = false;
let animationId;

// Displays
const logo = [...document.getElementsByTagName("img")][0];
const btnStart = [...document.getElementsByTagName("button")][0];

const canvas = document.getElementById("my-canvas");
canvas.setAttribute("width", "900");
canvas.setAttribute("height", "700");
const ctx = canvas.getContext("2d");

// Background
const bgImg1 = new Image();
bgImg1.src = "../images/bg.png";
const bgImg2 = new Image();
bgImg2.src = "../images/bg.png";
const bgImg1start = 0;
const bgImg2start = 900;
const bgImgSpeed = 1;
let bgImg1X = bgImg1start;
let bgImg2X = bgImg2start;

// Player
const playerImg = new Image();
playerImg.src = "../images/flappy.png";
const playerWidth = 75;
const playerHeight = 50;
const playerSpeedY = 5;
const playerMaxSpeed = 5;
let playerGrvSpeed = 0;
let playerGrv = 1;
let playerPosX = 200;
let playerPosY = 200;
let playerUp = false;

// Obstacles
const obstacleArray = [];
const obstacleBottomImg = new Image();
obstacleBottomImg.src = "../images/obstacle_bottom.png";
const obstacleTopImg = new Image();
obstacleTopImg.src = "../images/obstacle_top.png";
const obstacleSpeed = 2;

// --- Class
class Obstacles {
  constructor(x, y, oWidth, oHeight, img) {
    this.x = x;
    this.y = y;
    this.width = oWidth;
    this.height = oHeight;
    this.img = img;

    this.givenScore = false;
  }

  updateObstacle() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

// Game
window.onload = function() {
  document.getElementById("start-button").onclick = function() {
    startGame();
  };

  function startGame() {
    logo.style.display = "none";
    btnStart.style.display = "none";
    animate();
  }

  function animate() {
    // Clear Screen for re-drawing
    gameFrames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Backgrounds
    updateBackgrounds();
    // Player
    updatePlayer();
    // Obstacles
    updateObstacles();
    // Score
    drawScore();

    // Gameplay loop
    if (!gameOver) {
      animationId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationId);
    }
  }

  function updateBackgrounds() {
    // Draw and move Background
    ctx.drawImage(bgImg1, bgImg1X, 0, canvas.width, canvas.height)
    ctx.drawImage(bgImg2, bgImg2X, 0, canvas.width, canvas.height)
    bgImg1X -= bgImgSpeed
    bgImg2X -= bgImgSpeed
    if (bgImg1X === -bgImg1.width) bgImg1X = bgImg2X + bgImg2.width;
    if (bgImg2X === -bgImg2.width) bgImg2X = bgImg1X + bgImg1.width;
  }

  function updatePlayer() {
    // Player
    ctx.drawImage(playerImg, playerPosX, playerPosY, playerWidth, playerHeight);
    // Control
    if (playerUp && playerPosY > 0) {
      playerGrv = -0.7;
    } else {
      playerGrv = 0.7;
    }
    if (playerGrvSpeed < playerMaxSpeed) playerGrvSpeed++;
    playerPosY += playerGrvSpeed * playerGrv;

    // Collision check
    if (playerPosY >= canvas.height - playerHeight) {
      gameOver = true;
    }
  }

  function updateObstacles() {
    for (let i = 0; i < obstacleArray.length; i++) {
      // Move obstacle
      obstacleArray[i].x -= obstacleSpeed;
      obstacleArray[i].updateObstacle();

      // Collision Check
      const playerLeft = playerPosX;
      const playerRight = playerPosX + playerWidth;
      const playerTop = playerPosY;
      const playerBottom = playerPosY + playerHeight;
      const oLeft = obstacleArray[i].x;
      const oRight = obstacleArray[i].x + obstacleArray[i].width;
      const oTop = obstacleArray[i].y;
      const oBottom = obstacleArray[i].y + obstacleArray[i].height;

      if (playerLeft < oRight && playerRight > oLeft && playerTop < oBottom && playerBottom > oTop) {
        gameOver = true;
      } else if (playerLeft > oRight && !obstacleArray[i].givenScore) {
        hasScored();
        obstacleArray[i].givenScore = true;
      }

      // Score check
      if (obstacleArray[i].x < -obstacleArray[i].width) {
        score++;
        obstacleArray.slice[i, 1];
      }
    }
    
    // Spawn obstacles
    if (gameFrames % 240 === 0) {
      let x = canvas.width;
      let minHeight = 20;
      let maxHeight = 500;
      let height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
      let minGap = 150;
      let maxGap = 200;
      let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
      obstacleArray.push(new Obstacles(x, 0, 138, height, obstacleTopImg));
      obstacleArray.push(new Obstacles(x, height + gap, 138, x - height - gap, obstacleBottomImg));
    }
  }

  // Score
  ctx.font = ctx.font.replace(/\d+px/, (parseInt(ctx.font.match(/\d+px/)) + 15) + "px");
  function drawScore() {
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${score}`, 100, 100, 100)
    ctx.closePath();
  }

  function hasScored() {
    if (!justScored) {
      score++;
      justScored = true;
      setTimeout(() => justScored = false, 500)
    }
  }

  // Player control
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case " ":
        playerUp = true;
        setTimeout(() => playerUp = false, 250)
        break;
    }
  });
};
