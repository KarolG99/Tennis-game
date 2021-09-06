// wybranie przycisku i inne rzeczy z nim zwiazane
const button = document.querySelector('button');

// wybranie elementu canvas i przypisanie go do zmiennej
const canvas = document.querySelector('canvas');
// ustawienie contextu canvasa na 2d
const ctx = canvas.getContext('2d');

// ustawienie rozmiarow canvasa
canvas.width = 1000;
canvas.height = 500;

// przypisanie rozmiarow canvasa do zmiennych
const cw = canvas.width;
const ch = canvas.height;

// srednica pilki
const ballRadius = 13;

// poczatkowe polozenie pilki
let ballX = 500;
let ballY = 250;

// predkosc pilki
let ballSpeedX = 3;
let ballSpeedY = 3;

// rozmiary paletek
const paddleWidth = 20;
const paddleHeight = 100;

// polozenie paletki gracza
const playerX = 70;
let playerY = 200;

// polozenie paletki AI
const aiX = 910;
let aiY = 200;

// punkty
let points = 0;

// punkty komputera
let enemyPoints = 0;

// wlasciwosci linii 
let lineWidth = 6;
let lineHeight = 16;

// rysowanie lini na srodku stolu
function line() {
    for (let linePosition = 20; linePosition < ch; linePosition += 30) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(cw/2 - lineWidth/2, linePosition, lineWidth, lineHeight);
    }
}

// rysowanie pilki  
const ball = () => {
    // czyszczenie sladow na calym canvsie
    ctx.clearRect(0, 0, cw, ch);
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2, false);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
    // poruszanie pilki
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    // odbijanie od dolnej sciany
    if (ballY + ballRadius >= ch) {
        ballSpeedY = - ballSpeedY;
    }
    // odbijanie sie od gornej sciany
    if (ballY - ballRadius <= 0) {
        ballSpeedY = -ballSpeedY;
    }
    // odbijanie od paletki AI
    if ((ballX + ballRadius >= aiX) && (ballY + ballRadius >= aiY) && 
        (ballY - ballRadius <= aiY + paddleHeight)) {
        ballSpeedX = -ballSpeedX;
        ballX -= 5;
        speedUp();
        enemyPoints++;
    }
    // odbijanie od paletki gracza
    if ((ballX - ballRadius <= playerX + paddleWidth) && (ballY + ballRadius >= playerY) &&
        (ballY - ballRadius<= playerY + paddleHeight) ) {
            ballSpeedX = - ballSpeedX;
            ballX += 5;
            points++;
            speedUp();
        }

    // gdy ktos przegra
    if (ballX  <= playerX) {
        alert('PRZEGRANA');
        resetBall();
    } else if (ballX  >= aiX + paddleWidth) {
        alert('WYGRANA');
        resetBall();
    }
}


// rysowanie paletki gracza
const player = () => {
    ctx.fillStyle = '#1b6dc5';
    ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight)
}

// rysowanie paletki AI
const ai = () => {
    ctx.fillStyle = '#fff82b';
    ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight);
}

// przyspieszenie pilki
function speedUp() {
    // predkosc x
    if (ballSpeedX > 0 && ballSpeedX < 16) {
        ballSpeedX += .4;
    } else if (ballSpeedX < 0 && ballSpeedX > -16) {
        ballSpeedX -= .4;
    }
    if (ballSpeedY > 0 && ballSpeedY < 16) {
        ballSpeedY += .3;
    } else if (ballSpeedY < 0 && ballSpeedY > -16) {
        ballSpeedY -= .3;
    }
}

// sterowanie myszka 

const topCanvas = canvas.offsetTop;

function playerPosition(e) {
    //przypisanie paletki gracza do pozycji kursora
    playerY = e.clientY - topCanvas - paddleHeight / 2;

    // gdy probuje wyjechac na dol poza canvas
    if (playerY >= ch - paddleHeight) {
        playerY = ch - paddleHeight;
    }

    // gdy probuje wyjechac rakietka poza gore canvasa
    if (playerY <= 0) {
        playerY = 0;
    }

}

function aiPosition() {
    const middlePaddle = aiY + paddleHeight / 2;
    const middleBall = ballY;

    //gdy pilka jest na prawej stronie canvas
    if (ballX > 500) {
        if (middlePaddle - middleBall > 200) {
            aiY -= 29;
        }
        else if (middlePaddle - middleBall > 50) {
            aiY -= 15;
        }

        else if (middlePaddle - middleBall < -200) {
            aiY += 29;
        }
        else if (middlePaddle - middleBall < -50) {
            aiY += 15;
        }
    }

    // gdy pilka jest po lewej stornie canvas
    if (ballX <= 500 && ballX > 100) {
        if (middlePaddle - middleBall > 100) {
            aiY -= 3;
        }
        else if (middlePaddle - middleBall < -100) {
            aiY += 3;
        }
    }

    // gdy probuje wyjechac na dol poza canvas
    if (aiY >= ch - paddleHeight) {
        aiY = ch - paddleHeight;
    }

    else if (aiY <= 0) {
        aiY = 0;
    }

}

// pisanie bierzacej liczby punktow gracza
function drawScore() {
    ctx.font = '35px Arial';
    ctx.fillStyle = '#1b6dc5';
    ctx.fillText(points, 6, 30);
}

// pisanie bierzacej liczby punktow przeciwnika
function drawScore2() {
    ctx.font = '35px Arial';
    ctx.fillStyle = '#fff82b';
    ctx.fillText(enemyPoints, 940, 30);
}

// resetowanie gry
function resetBall() {
    ballX = 500;
    ballY = 250;
    ballSpeedX = 3;
    ballSpeedY = 3;
    points = 0;
    enemyPoints = 0;
}


function game() {
    ball();
    player();
    ai();
    line();
    aiPosition();
    drawScore();
    drawScore2();
    requestAnimationFrame(game);
}
    line();
    ball();
    player();
    ai();

button.addEventListener('click', game);

canvas.addEventListener('mousemove', playerPosition);

// const renderGame = setInterval(game, 1000/60);
// renderGame();
