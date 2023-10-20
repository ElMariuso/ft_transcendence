import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
    state: () => ({
        score1: 0,
        score2: 0,
        racket1Size: { width: 6, height: 42 },
        racket2Size: { width: 6, height: 42 },
        racket1Position: { x: 0, y: 0 },
        racket2Position: { x: 0, y: 0 },
        ballPosition: { x: 0, y: 0 }
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
        },
        updateScore1(newScore) {
            this.score1 = newScore;
        },
        updateScore2(newScore) {
            this.score2 = newScore;
        }
    },
});