import { updateGame } from '@/services/matchmaking-helpers';
import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
    state: () => ({
        canvasSize: { width: 0, height: 0},
        score1: 0,
        score2: 0,
        racket1Size: { width: 6, height: 42 },
        racket2Size: { width: 6, height: 42 },
        racket1Position: { x: 0, y: 0 },
        racket2Position: { x: 0, y: 0 },
        ballPosition: { x: 0, y: 0 },
        isFirstPlayer: true,
    }),
    actions: {
        initializeGame(canvas) {
            this.racket1Position = {
                x: 30,
                y: canvas.height / 2 - this.racket1Size.height / 2
            };
            this.racket2Position = {
                x: canvas.width - this.racket2Size.width - 30,
                y: canvas.height / 2 - this.racket2Size.height / 2
            };

            this.canvasSize = {
                width: canvas.width,
                height: canvas.height
            };
        },
        setIsFirstPlayer(value) {
            this.isFirstPlayer = value;
        },
        updateScore1(newScore) {
            this.score1 = newScore;
        },
        updateScore2(newScore) {
            this.score2 = newScore;
        },
        racket1Up(isTriggered) {
            if (this.racket1Position.y > 0) {
                this.racket1Position.y -= 3;
                if (isTriggered)
                    updateGame('racket1-up');
            }
        },
        racket1Down(isTriggered) {
            if (this.racket1Position.y < this.canvasSize.height - this.racket1Size.height) {
                this.racket1Position.y += 3;
                if (isTriggered)
                    updateGame('racket1-down');
            }
        },
        racket2Up(isTriggered) {
            if (this.racket2Position.y > 0) {
                this.racket2Position.y -= 3;
                if (isTriggered)
                    updateGame('racket2-up');
            }
        },
        racket2Down(isTriggered) {
            if (this.racket2Position.y < this.canvasSize.height - this.racket2Size.height) {
                this.racket2Position.y += 3;
                if (isTriggered)
                    updateGame('racket2-down');
            }
        },
    },
});