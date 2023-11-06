import { Injectable } from '@nestjs/common';
import { Player, Direction, EndReason, EndMatchResult, size, position } from 'src/Model/gamestate.model';

@Injectable()
export class GameStateService {
    private static readonly WINNING_SCORE = 5;
    private static readonly BALL_LAUNCH_DELAY_MS = 1500;
    private static readonly RACKET_MOVEMENT = 12;
    private static readonly INITIAL_BALL_SPEED = 3;

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
    playerReady: { first: boolean, second: boolean };
    wantBaseGame: { first: boolean, second: boolean };
    smallRacket: { first: boolean, second: boolean };
    obstacle: { first: boolean, second: boolean };
    obstacle1Size: size;
    obstacle2Size: size;
    obstacle1Position: position;
    obstacle2Position: position;

    private endMatchCallback: (result: EndMatchResult) => void;
    public initialize(
        player1ID: number | string,
        player2ID: number | string,
        player1Username: string,
        player2Username: string,
        endMatchCallback: (result: EndMatchResult) => void
    ): void {
        this.player1ID = player1ID;
        this.player2ID = player2ID;
        this.player1Username = player1Username;
        this.player2Username = player2Username;
        this.endMatchCallback = endMatchCallback;
        this.initializeDefaultValues(); 
    }

    private initializeDefaultValues(): void {
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
        this.ballSpeed = GameStateService.INITIAL_BALL_SPEED;
        this.wantBaseGame = { first: false, second: false };
        this.playerReady = { first: false, second: false };
        this.smallRacket = { first: false, second: false };
        this.obstacle = { first: false, second: false };
        this.obstacle1Size = { width: 0, height: 0 };
        this.obstacle2Size = { width: 0, height: 0 };
        this.obstacle1Position = { x: 0, y: 0 };
        this.obstacle2Position = { x: 0, y: 0 };
        this.resetBall();
    }

    moveRacket(player: Player, direction: Direction): void {
        if (!this.playerReady.first && !this.playerReady.second)
            return ;
        let racketPosition = player === Player.Player1 ? this.racket1Position : this.racket2Position;
        let racketSize = player === Player.Player1 ? this.racket1Size : this.racket2Size;

        if (direction === Direction.Up && racketPosition.y > 0) {
            racketPosition.y -= GameStateService.RACKET_MOVEMENT;
        } else if (direction === Direction.Down && racketPosition.y < this.canvasSize.height - racketSize.height) {
            racketPosition.y += GameStateService.RACKET_MOVEMENT;
        }
    }

    updateBallPosition() {
        if (!this.isGameEnded()) {
            this.ballMovement();
        } else {
            this.resetBallPostMatch();
        }
    }

    private isGameEnded(): boolean {
        return this.score1 === GameStateService.WINNING_SCORE || this.score2 === GameStateService.WINNING_SCORE;
    }

    private resetBallPostMatch() {
        this.ballPosition = { x: this.canvasSize.width / 2, y: this.canvasSize.height / 2 };
        this.ballSize = { width: 0, height: 0 };
    }

    private ballMovement() {
        this.ballPosition.x += this.ballVelocity.x;
        this.ballPosition.y += this.ballVelocity.y;
        this.checkCollisions();
    }

    private checkCollisions() {
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
    
        if (intersectsWithRacket1) {
            this.ballPosition.x = this.racket1Position.x + this.racket1Size.width + ballHalfWidth;
            this.ballVelocity.x *= -1;
        }
    
        if (intersectsWithRacket2) {
            this.ballPosition.x = this.racket2Position.x - ballHalfWidth;
            this.ballVelocity.x *= -1;
        }
    
        let intersectsWithObstacle1 = this.obstacle.first && 
            ballLeft <= this.obstacle1Position.x + this.obstacle1Size.width &&
            ballRight >= this.obstacle1Position.x &&
            ballBottom >= this.obstacle1Position.y &&
            ballTop <= this.obstacle1Position.y + this.obstacle1Size.height;
    
        let intersectsWithObstacle2 = this.obstacle.second && 
            ballRight >= this.obstacle2Position.x &&
            ballLeft <= this.obstacle2Position.x + this.obstacle2Size.width &&
            ballBottom >= this.obstacle2Position.y &&
            ballTop <= this.obstacle2Position.y + this.obstacle2Size.height;
    
        if (intersectsWithObstacle1) {
            if (this.ballVelocity.x > 0) {
                this.ballPosition.x = this.obstacle1Position.x - ballHalfWidth;
            } else {
                this.ballPosition.x = this.obstacle1Position.x + this.obstacle1Size.width + ballHalfWidth;
            }
            this.ballVelocity.x *= -1;
        }
    
        if (intersectsWithObstacle2) {
            if (this.ballVelocity.x > 0) {
                this.ballPosition.x = this.obstacle2Position.x - ballHalfWidth;
            } else {
                this.ballPosition.x = this.obstacle2Position.x + this.obstacle2Size.width + ballHalfWidth;
            }
            this.ballVelocity.x *= -1;
        }
    
        if (ballLeft <= 0) {
            this.updateScore(1, Player.Player2);
            this.resetBall();
        } else if (ballRight >= this.canvasSize.width) {
            this.updateScore(1, Player.Player1);
            this.resetBall();
        }
    }    

    private resetBall() {
        this.ballSize = { width: 0, height: 0 };
        this.ballPosition = { x: this.canvasSize.width / 2, y: this.canvasSize.height / 2 };
        this.ballVelocity = { x: 0, y: 0 };

        setTimeout(() => {
            this.launchBall();
        }, GameStateService.BALL_LAUNCH_DELAY_MS);
    }

    private launchBall(): void {
        const isTopPosition = Math.random() < 0.5;
        const newYPosition = isTopPosition 
            ? this.canvasSize.height / 6 + Math.random() * (this.canvasSize.height / 6)
            : this.canvasSize.height * 4/6 + Math.random() * (this.canvasSize.height / 6);

        this.ballPosition = { x: this.canvasSize.width / 2, y: newYPosition };

        const isGoingRight = Math.random() < 0.5;
        const angle = this.calculateBallAngle(isGoingRight, isTopPosition);
        this.ballVelocity = {
            x: Math.cos(angle) * this.ballSpeed,
            y: Math.sin(angle) * this.ballSpeed
        };
        this.ballSize = { width: 10, height: 10 };
    }

    private calculateBallAngle(isGoingRight: boolean, isTopPosition: boolean): number {
        if (isGoingRight) {
            return isTopPosition ? 3 * Math.PI / 4 : Math.PI / 4;
        } else {
            return isTopPosition ? Math.PI / 4 : 3 * Math.PI / 4;
        }
    }

    private updateScore(value, target: Player) {
        if (target === Player.Player1)
            this.score1 += value;
        else
            this.score2 += value;
        this.checkEndMatch();
    }

    private checkEndMatch() {
        if (this.score1 === GameStateService.WINNING_SCORE) {
            this.endMatch(Player.Player1, EndReason.Score);
            this.resetBallPostMatch();
        } else if (this.score2 === GameStateService.WINNING_SCORE) {
            this.endMatch(Player.Player2, EndReason.Score);
            this.resetBallPostMatch();
        }
    }

    setForfeit(playerID: string | number) {
        if (playerID === this.player1ID) {
            this.endMatch(Player.Player2, EndReason.Forfeit);
        } else if (playerID === this.player2ID) {
            this.endMatch(Player.Player1, EndReason.Forfeit);
        } else {
            throw new Error('BadTargetForfeit');
        }
    }

    private endMatch(winner: Player, reason: EndReason): void {
        const result: EndMatchResult = {
            winner: winner,
            reason: reason
        };
        this.endMatchCallback(result);
    }

    setReady(value: boolean, target: string) {
        if (target === 'player1') {
            this.playerReady.first = value;
        } else {
            this.playerReady.second = value;
        }
    }

    setWantBaseGame(value: boolean, target: string) {
        if (target === 'player1') {
            this.wantBaseGame.first = value;
        } else {
            this.wantBaseGame.second = value;
        }
        if (this.wantBaseGame.first || this.wantBaseGame.second) {
            this.setSmallRacket(false, 'player1');
            this.setSmallRacket(false, 'player2');
            this.setObstacle(false, 'player1');
            this.setObstacle(false, 'player2');
        }
    }

    setSmallRacket(value: boolean, target: string) {
        if (target === 'player1') {
            this.smallRacket.first = value;
            if (this.smallRacket.first) {
                this.racket1Size = { width: 6, height: 21 };
            } else {
                this.racket1Size = { width: 6, height: 42 };
            }
        } else {
            this.smallRacket.second = value;
            if (this.smallRacket.second) {
                this.racket2Size = { width: 6, height: 21 };
            } else {
                this.racket2Size = { width: 6, height: 42 };
            }
        }
    }

    setObstacle(value: boolean, target: string) {
        if (target === 'player1') {
            this.obstacle.first = value;
            if (this.obstacle.first) {
                this.obstacle1Size = { width: 6, height: 42 };
                this.obstacle1Position = {
                    x: this.canvasSize.width / 3 - this.obstacle1Size.width / 2,
                    y: this.canvasSize.height / 2 - this.obstacle1Size.height / 2
                };
            } else {
                this.obstacle1Size = { width: 0, height: 0 };
                this.obstacle1Position = { x: 0, y: 0 };
            }
        } else {
            this.obstacle.second = value;
            if (this.obstacle.second)  {
                this.obstacle2Size = { width: 6, height: 42 };
                this.obstacle2Position = {
                    x: this.canvasSize.width * 2/3 - this.obstacle2Size.width / 2,
                    y: this.canvasSize.height / 2 - this.obstacle2Size.height / 2
                };
            } else {
                this.obstacle2Size = { width: 0, height: 0 };
                this.obstacle2Position = { x: 0, y: 0 };
            }
        }
    }
}