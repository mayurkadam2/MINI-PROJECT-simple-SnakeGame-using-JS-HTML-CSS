const board = document.querySelector('.board');
const startButton = document.querySelector(".btn-start");
const restartButton = document.querySelector(".btn-restart");
const modal = document.querySelector(".modal");
const startgameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".restart-game");
const instructionBoard = document.querySelector(".welcome-board");
const instructionCloseBtn = document.querySelector(".instruction-close");

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector('#time');
//the property of the box we set in css
const blockHeight = 40;
const blockWidth = 40;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let intervalId = null;
let timerIntervalID = null;


let highScore = localStorage.getItem("highScore") || 0;
highScoreElement.innerHTML = highScore;
let score = 0;
let time = "00:00";
//For Understanding the .appendChild method
// for(let i=0; i<cols*rows; i++){
//     const block = document.createElement('div');
//     block.classList.add("box");
//     board.appendChild(block);
// }

var direction = "right";

const blocks = {};
//head-body-tail
let snake = [{ x: 7, y: 7 }, { x: 6, y: 7 }, { x: 5, y: 7 }];
let food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };

//for keeping track of the row and column
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("box");
        board.appendChild(block);
        // block.innerText = `${col} ${row}`;
        blocks[`${col}-${row}`] = block;

    }
}
let head = {};
function render() {


    blocks[`${food.x}-${food.y}`].classList.add("food");

    if (direction === "up") {
        head = { x: snake[0].x, y: snake[0].y - 1 };
    }
    else if (direction === "down") {
        head = { x: snake[0].x, y: snake[0].y + 1 };
    }
    else if (direction === "left") {
        head = { x: snake[0].x - 1, y: snake[0].y };
    }
    else if (direction === "right") {
        head = { x: snake[0].x + 1, y: snake[0].y };
    }


    //coliltion to boundries
    if (head.x < 0 || head.x > cols - 1 || head.y < 0 || head.y > rows - 1) {
        // alert("Game Over");
        clearInterval(intervalId);
        modal.style.display = "flex";
        startgameModal.style.display = "none";
        instructionBoard.style.display = "none";

        gameOverModal.style.display = "flex";
    }

    //eating the food
    if (head.x == food.x && head.y == food.y) {
        blocks[`${snake[0].x}-${snake[0].y}`].classList.remove('head');
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
        blocks[`${food.x}-${food.y}`].classList.add("food");
        snake.unshift(head);

        //score Updation
        score++;
        scoreElement.textContent = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore.toString());
        }

    }

    unrender();
    snake.unshift(head);
    snake.pop();




    blocks[`${snake[0].x}-${snake[0].y}`].classList.add('head');
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add('fill');
    });

}

function unrender() {
    blocks[`${snake[0].x}-${snake[0].y}`].classList.remove('head');
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill');
    });
}

startButton.addEventListener('click', () => {
    modal.style.display = "none";
    intervalId = setInterval(() => { render() }, 300);
    timerIntervalID = setInterval(()=>{
        let [min,sec] = time.split(":").map(Number);

        if(sec == 59){
            min++;
            sec = 0;
        }else{
            sec++;
        }

        time = `${min}:${sec}`;
        timeElement.innerText = time;
    },1000);
});


restartButton.addEventListener('click', restartGame);

instructionCloseBtn.addEventListener('click', () =>{
    instructionBoard.style.display = 'none';
})

function restartGame() {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    modal.style.display = "none";
    direction = "right";
    score = 0;
    time = "00:00";
    timeElement.innerText = time;
    highScoreElement.innerHTML = highScore;
    scoreElement.textContent = score;
    snake = [{ x: 3, y: 2 }, { x: 2, y: 2 }, { x: 1, y: 2 }];
    food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    intervalId = setInterval(() => { render() }, 300);
    
}

addEventListener("keydown", (event) => {
    if (event.key == "ArrowUp") {
        direction = "up";
    }
    else if (event.key == "ArrowDown") {
        direction = "down";
    }
    else if (event.key == "ArrowRight") {
        direction = "right";
    }
    else if (event.key == "ArrowLeft") {
        direction = "left";
    }
});