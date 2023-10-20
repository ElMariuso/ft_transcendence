export function gameLoop(context, canvas, gameStore) {
    function loop() {
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);

        drawGame(context, canvas, gameStore.racket1Size, gameStore.racket2Size, gameStore.racket1Position, gameStore.racket2Position, gameStore.score1, gameStore.score2);

        requestAnimationFrame(loop);
    }
    loop();
}

function drawGame(context, canvas, racket1Size, racket2Size, racket1Position, racket2Position, score1, score2) {
    drawNet(context, canvas);
    drawPaddle(context, racket1Position.x, racket1Position.y, racket1Size.width, racket1Size.height);
    drawPaddle(context, racket2Position.x, racket2Position.y, racket2Size.width, racket2Size.height);

    context.fillStyle = 'white';
    context.font = '35px Arial';

    const player1ScoreX = canvas.width / 4;
    const player2ScoreX = (canvas.width / 4) * 3;
    const scoreY = 50;

    context.fillText(String(score1), player1ScoreX, scoreY);
    context.fillText(String(score2), player2ScoreX, scoreY);
}

function drawPaddle(context, x, y, width, height) {
    context.fillStyle = 'white';
    context.fillRect(x, y, width, height);
}

function drawNet(context, canvas) {
    const netWidth = 3;
    const netHeight = 16;
    const spaceBetween = 16;

    context.fillStyle = 'white';

    for (let y = netHeight; y < canvas.height; y += (netHeight + spaceBetween)) {
        context.fillRect(canvas.width / 2 - netWidth / 2, y, netWidth, netHeight);
    }
}
