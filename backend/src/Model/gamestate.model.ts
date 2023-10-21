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
    ballVelocity: { x: number; y: number; };
    ballSpeed: number;

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

        this.ballSpeed = 3;
        this.resetBall();
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

    updateBallPosition() {
        this.ballPosition.x += this.ballVelocity.x;
        this.ballPosition.y += this.ballVelocity.y;
        this.checkCollisions();
    }

    checkCollisions() {
        const ballHalfWidth = this.ballSize.width / 2;
        const ballHalfHeight = this.ballSize.height / 2;
    
        const ballLeft = this.ballPosition.x - ballHalfWidth;
        const ballRight = this.ballPosition.x + ballHalfWidth;
        const ballTop = this.ballPosition.y - ballHalfHeight;
        const ballBottom = this.ballPosition.y + ballHalfHeight;
    
        if (ballTop <= 0 || ballBottom >= this.canvasSize.height) {
            this.ballVelocity.y *= -1;
        }

        let intersectsWithRacket1 = ballLeft <= this.racket1Position.x + this.racket1Size.width &&
            ballRight >= this.racket1Position.x &&
            ballBottom >= this.racket1Position.y &&
            ballTop <= this.racket1Position.y + this.racket1Size.height;
    
        let intersectsWithRacket2 = ballRight >= this.racket2Position.x &&
            ballLeft <= this.racket2Position.x + this.racket2Size.width &&
            ballBottom >= this.racket2Position.y &&
            ballTop <= this.racket2Position.y + this.racket2Size.height;
    
        if (intersectsWithRacket1 || intersectsWithRacket2) {
            this.ballVelocity.x *= -1;
        }
        if (ballLeft <= 0) {
            this.updateScore2(1);
            this.resetBall();
        } else if (ballRight >= this.canvasSize.width) {
            this.updateScore1(1);
            this.resetBall();
        }
    }
    

    resetBall() {
        this.ballPosition = { x: this.canvasSize.width / 2, y: this.canvasSize.height / 2 };
        const angle = Math.random() * Math.PI * 2;
        this.ballVelocity = {
            x: Math.cos(angle) * this.ballSpeed,
            y: Math.sin(angle) * this.ballSpeed
        };
    }
}