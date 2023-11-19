import { askGamesInformations, updateRacket } from "./matchmaking-helpers";

export function gameLoop(context, canvas, gameStore, roomId, movingUp, movingDown) {
    function loop() {
        const gameState = gameStore.gameState;
        const matchResult = gameStore.matchResult;
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);

        if (gameState) {
            if (movingUp.value) {
                gameStore.isFirstPlayer ? updateRacket(roomId, 'racket1-up') : updateRacket(roomId, 'racket2-up');
            } else if (movingDown.value) {
                gameStore.isFirstPlayer ? updateRacket(roomId, 'racket1-down') : updateRacket(roomId, 'racket2-down');
            }
            if (matchResult) {
                let username;

                if (matchResult.winner === 'player1')
                    username = gameState.player1Username;
                else
                    username = gameState.player2Username;
                drawWinner(context, canvas, username, matchResult.reason);
            } else {
                if (gameStore.count > 0) {
                    drawCountdown(context, canvas, gameStore.count);
                } else {
                    drawGame(context, canvas, gameState.racket1Size, gameState.racket2Size, gameState.racket1Position, gameState.racket2Position, gameState.ballSize, gameState.ballPosition, gameState.score1, gameState.score2, gameState.obstacle1Size, gameState.obstacle1Position, gameState.obstacle2Size, gameState.obstacle2Position);
                }
            }
        }
        requestAnimationFrame(loop);
    }
    loop();
}

function drawGame(context, canvas, racket1Size, racket2Size, racket1Position, racket2Position, ballSize, ballPosition, score1, score2, obstacle1Size, obstacle1Position, obstacle2Size, obstacle2Position) {
    drawNet(context, canvas);
    drawSquare(context, racket1Position.x, racket1Position.y, racket1Size.width, racket1Size.height);
    drawSquare(context, racket2Position.x, racket2Position.y, racket2Size.width, racket2Size.height);
    drawSquare(context, obstacle1Position.x, obstacle1Position.y, obstacle1Size.width, obstacle1Size.height);
    drawSquare(context, obstacle2Position.x, obstacle2Position.y, obstacle2Size.width, obstacle2Size.height);
    drawSquareFromCenter(context, ballPosition.x, ballPosition.y, ballSize.width, ballSize.height);

    context.fillStyle = 'white';
    context.font = '35px Arial';

    const player1ScoreX = canvas.width / 4;
    const player2ScoreX = (canvas.width / 4) * 3;
    const scoreY = 50;

    context.fillText(String(score1), player1ScoreX, scoreY);
    context.fillText(String(score2), player2ScoreX, scoreY);
}

function drawSquare(context, x, y, width, height) {
    context.fillStyle = 'white';
    context.fillRect(x, y, width, height);
}

function drawSquareFromCenter(context, x, y, width, height) {
    context.fillStyle = 'white';
    context.fillRect(x - width / 2, y - height / 2, width, height);
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

function drawWinner(context, canvas, winner, reason) {
    context.fillStyle = 'white';
    context.font = '50px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    const reasonText = reason === 'forfeit' ? 'Opponent forfeited' : 'Score done';
    const winnerText = `${winner} has won!`;
    const centerY = canvas.height / 2;

    context.fillText(winnerText, canvas.width / 2, centerY - 30);
    context.font = '40px Arial';
    context.fillText(reasonText, canvas.width / 2, centerY + 40);
}

function drawCountdown(context, canvas, count) {
    if (count > -1) {
        context.fillStyle = 'rgba(0, 0, 0, 0.75)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = 'white';
        context.font = '100px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(count.toString(), canvas.width / 2, canvas.height / 2);
    }
}
