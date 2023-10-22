export enum Player {
    Player1 = 'player1',
    Player2 = 'player2'
}

export enum Direction {
    Up = 'up',
    Down = 'down'
}

interface size {
    width: number;
    height: number;
}

interface position {
    x: number;
    y: number;
}

type EndMatchCallback = (winner: string) => void;

export class GameState {
    player1ID: number | string;
    player2ID: number | string;
    player1Username: string;
    player2Username: string;
    canvasSize: size;
    score1: number;
    score2: number;
    racket1Size: size;
    racket2Size: size;
    racket1Position: position;
    racket2Position: position;
    ballSize: size;
    ballPosition: position;
    ballVelocity: position;
    ballSpeed: number;

    private endMatchCallback: (winner: string) => void;
    constructor(
        player1ID: number | string,
        player2ID: number | string,
        player1Username: string,
        player2Username: string,
        endMatchCallback: EndMatchCallback
    ) {
        this.player1ID = player1ID;
        this.player2ID = player2ID;
        this.player1Username = player1Username;
        this.player2Username = player2Username;
        this.endMatchCallback = endMatchCallback;
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

    updateScore(value, target: Player) {
        if (target === Player.Player1)
            this.score1 += value;
        else
            this.score2 += value;
        this.checkEndMatch();
    }

    moveRacket(player: Player, direction: Direction): void {
        const movement = 6;
        let racketPosition: position;
        let racketSize: size;
    
        if (player === Player.Player1) {
            racketPosition = this.racket1Position;
            racketSize = this.racket1Size;
        } else {
            racketPosition = this.racket2Position;
            racketSize = this.racket2Size;
        }
    
        if (direction === Direction.Up && racketPosition.y > 0) {
            racketPosition.y -= movement;
        } else if (direction === Direction.Down && racketPosition.y < this.canvasSize.height - racketSize.height) {
            racketPosition.y += movement;
        }
    }

    updateBallPosition() {
        if (this.score1 !== 5 && this.score2 !== 5) {
            this.ballPosition.x += this.ballVelocity.x;
            this.ballPosition.y += this.ballVelocity.y;
            this.checkCollisions();
        } else {
            this.ballPosition = { x: this.canvasSize.width / 2, y: this.canvasSize.height / 2 };
            this.ballSize = { width: 0, height: 0 };
        }
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
            this.updateScore(1, Player.Player1);
            this.resetBall();
        } else if (ballRight >= this.canvasSize.width) {
            this.updateScore(1, Player.Player2);
            this.resetBall();
        }
    }

    resetBall() {
        this.ballSize = { width: 0, height: 0 };
        this.ballPosition = { x: this.canvasSize.width / 2, y: this.canvasSize.height / 2 };
        this.ballVelocity = { x: 0, y: 0 };

        const launchBall = () => {
            const isTopPosition = Math.random() < 0.5;
          
            let newYPosition;
            if (isTopPosition) {
                newYPosition = this.canvasSize.height / 6 + Math.random() * (this.canvasSize.height / 6);
            } else {
                newYPosition = this.canvasSize.height * 4/6 + Math.random() * (this.canvasSize.height / 6);
            }
            this.ballPosition = { x: this.canvasSize.width / 2, y: newYPosition };
    
            const isGoingRight = Math.random() < 0.5;
            let angle;
            if (isGoingRight) {
                angle = isTopPosition ? 3 * Math.PI / 4 : Math.PI / 4;
            } else {
                angle = isTopPosition ? Math.PI / 4 : 3 * Math.PI / 4;
            }
            this.ballVelocity = {
                x: Math.cos(angle) * this.ballSpeed,
                y: Math.sin(angle) * this.ballSpeed
            };
            this.ballSize = { width: 10, height: 10 };
        };
        setTimeout(launchBall, 1500);
    }    
    
    setForfeit(playerID: string | number) {
        if (playerID == this.player1ID)
            this.endMatchCallback('player2');
        else if (playerID == this.player2ID)
            this.endMatchCallback('player1');
        else
            console.error('BadTargetForfeit');
    }

    private checkEndMatch() {
        if (this.score1 === 5) {
            this.endMatchCallback('player1');
        } else if (this.score2 === 5) {
            this.endMatchCallback('player2');
        }
    }
}