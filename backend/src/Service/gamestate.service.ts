import { Injectable } from '@nestjs/common';
import { Player, Direction, EndReason, EndMatchResult, size, position } from 'src/Model/gamestate.model';

@Injectable()
export class GameStateService {
    private static readonly WINNING_SCORE = 5;
    private static readonly BALL_LAUNCH_DELAY_MS = 1500;
    private static readonly RACKET_MOVEMENT = 6;
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
        this.playerReady = { first: false, second: false };
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
        } else if (this.score2 === GameStateService.WINNING_SCORE) {
            this.endMatch(Player.Player2, EndReason.Score);
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
        }
        else {
            this.playerReady.second = value;
        }
    }
}