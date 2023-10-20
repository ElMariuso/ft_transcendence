export const paddleWidth = 6;
export const paddleHeight = 42;

export function gameLoop(context, canvas, leftPaddle, rightPaddle, player1Score = 0, player2Score = 0) {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawGame(context, canvas, leftPaddle, rightPaddle, player1Score, player2Score);

    requestAnimationFrame(() => gameLoop(context, canvas, leftPaddle, rightPaddle, player1Score, player2Score));
}

function drawGame(context, canvas, leftPaddle, rightPaddle, player1Score = 0, player2Score = 0) {
    drawNet(context, canvas);

    drawPaddle(context, leftPaddle.x, leftPaddle.y);
    drawPaddle(context, rightPaddle.x, rightPaddle.y);

    context.fillStyle = 'white';
    context.font = '35px Arial';

    const player1ScoreX = canvas.width / 4;
    const player2ScoreX = (canvas.width / 4) * 3;
    const scoreY = 50;

    context.fillText(String(player1Score), player1ScoreX, scoreY);
    context.fillText(String(player2Score), player2ScoreX, scoreY);
}

function drawPaddle(context, x, y) {
    context.fillStyle = 'white';
    context.fillRect(x, y, paddleWidth, paddleHeight);
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
