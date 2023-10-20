export class GameState {
    canvasSize: { width: number; height: number; };
    score1: number;
    score2: number;
    racket1Size: { width: number; height: number; };
    racket2Size: { width: number; height: number; };
    racket1Position: { x: number; y: number; };
    racket2Position: { x: number; y: number; };
    ballSize: { width: number; height: number; };
    ballPosition: { x: number; y: number; };

    constructor() {
        this.canvasSize = { width: 858, height: 525 };
        this.score1 = 0;
        this.score2 = 0;
        this.racket1Size = { width: 6, height: 42 };
        this.racket2Size = { width: 6, height: 42 };
        this.racket1Position = { 
            x: 30, 
            y: this.canvasSize.height / 2 - this.racket1Size.height / 2 
        };
        this.racket2Position = {
            x: this.canvasSize.width - this.racket2Size.width - 30,
            y: this.canvasSize.height / 2 - this.racket2Size.height / 2
        };
        this.ballSize = { width: 10, height: 10 };
        this.ballPosition = {
            x: 60,
            y: 60
        };
    }

    updateScore1(value) {
        this.score1 += value;
    }

    updateScore2(value) {
        this.score2 += value;
    }

    racket1Up() {
        if (this.racket1Position.y > 0) {
            this.racket1Position.y -= 6;
        }
    }

    racket1Down() {
        if (this.racket1Position.y < this.canvasSize.height - this.racket1Size.height) {
            this.racket1Position.y += 6;
        }
    }

    racket2Up() {
        if (this.racket2Position.y > 0) {
            this.racket2Position.y -= 6;
        }
    }

    racket2Down() {
        if (this.racket2Position.y < this.canvasSize.height - this.racket2Size.height) {
            this.racket2Position.y += 6;
        }
    }
}