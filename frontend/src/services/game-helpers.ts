import { askGamesInformations, updateRacket } from "./matchmaking-helpers";

export function gameLoop(context, canvas, gameStore, roomId, movingUp, movingDown) {
    function loop() {
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        const gameState = gameStore.gameState;

        if (gameState) {
            if (movingUp.value) {
                gameStore.isFirstPlayer ? updateRacket(roomId, 'racket1-up') : updateRacket(roomId, 'racket2-up');
            } else if (movingDown.value) {
                gameStore.isFirstPlayer ? updateRacket(roomId, 'racket1-down') : updateRacket(roomId, 'racket2-down');
            }
            drawGame(context, canvas, gameState.racket1Size, gameState.racket2Size, gameState.racket1Position, gameState.racket2Position, gameState.score1, gameState.score2);
        }

        // if (movingUp.value) {
        //     gameStore.isFirstPlayer ? gameStore.racket1Up(true) : gameStore.racket2Up(true);
        // } else if (movingDown.value) {
        //     gameStore.isFirstPlayer ? gameStore.racket1Down(true) : gameStore.racket2Down(true);
        // }

        askGamesInformations(roomId);
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
