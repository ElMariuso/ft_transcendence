import { Injectable } from '@nestjs/common';
import { Player, Direction, EndReason, EndMatchResult, size, position } from 'src/Model/gamestate.model';

@Injectable()
export class GameStateService {
    // Constants defining various game settings
    private static readonly WINNING_SCORE = 5;
    private static readonly BALL_LAUNCH_DELAY_MS = 1500;
    private static readonly RACKET_MOVEMENT = 13;
    private static readonly INITIAL_BALL_SPEED = 3;
    private static readonly INITIAL_OBSTACLE_SPEED = 1;

    // Properties representing the state of players and the game
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
    obstacle1Direction: number;
    obstacle2Direction: number;

    // Callback to be invoked to end a match
    private endMatchCallback: (result: EndMatchResult) => void;

    /**
     * Initializes the game state with player information and the end match callback.
     * @param player1ID - ID of the first player.
     * @param player2ID - ID of the second player.
     * @param player1Username - Username of the first player.
     * @param player2Username - Username of the second player.
     * @param endMatchCallback - Callback function to invoke when the match ends.
     */
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

    /**
     * Initializes default values for a new game.
     */
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
        this.ballSize = { width: 0, height: 0 };
        this.ballPosition = { x: this.canvasSize.width / 2, y: this.canvasSize.height / 2 };
        this.ballVelocity = { x: 0, y: 0 };
        this.obstacle1Direction = 1;
        this.obstacle2Direction = -1;
        this.launchBall();
    }

    /**
     * Moves the racket of a player in a given direction.
     * @param player - The player whose racket is to be moved.
     * @param direction - The direction to move the racket.
     */
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

    /**
     * Updates the position of the ball on each tick of the game loop.
     */
    updateBallPosition() {
        if (!this.isGameEnded()) {
            this.ballMovement();
            this.obstacleMovement();
        } else {
            this.resetBallPostMatch();
        }
    }

    /**
     * Checks if the game has ended based on the scores.
     * @returns true if the game has ended, false otherwise.
     */
    private isGameEnded(): boolean {
        return this.score1 === GameStateService.WINNING_SCORE || this.score2 === GameStateService.WINNING_SCORE;
    }

    /**
     * Resets the ball position and size after a match is completed.
     */
    private resetBallPostMatch() {
        this.ballPosition = { x: this.canvasSize.width / 2, y: this.canvasSize.height / 2 };
        this.ballSize = { width: 0, height: 0 };
    }

    /**
     * Handles the movement of the ball, including collisions and scoring.
     */
    private ballMovement() {
        this.ballPosition.x += this.ballVelocity.x;
        this.ballPosition.y += this.ballVelocity.y;
        this.checkCollisions();
    }

    /**
     * Manages the movement of obstacles within the game.
     */
    private obstacleMovement() {
        const obstacleSpeed = GameStateService.INITIAL_OBSTACLE_SPEED;

        if (this.obstacle1Size.width > 0 && this.obstacle1Size.height > 0) {
            this.obstacle1Position.y += obstacleSpeed * this.obstacle1Direction;
            if (this.obstacle1Position.y <= 0 || this.obstacle1Position.y + this.obstacle1Size.height >= this.canvasSize.height) {
                this.obstacle1Direction *= -1;
            }
        }
        if (this.obstacle2Size.width > 0 && this.obstacle2Size.height > 0) {
            this.obstacle2Position.y += obstacleSpeed * this.obstacle2Direction;
            if (this.obstacle2Position.y <= 0 || this.obstacle2Position.y + this.obstacle2Size.height >= this.canvasSize.height) {
                this.obstacle2Direction *= -1;
            }
        }
    }

    /**
     * Checks and handles collisions of the ball with rackets, obstacles, and canvas edges.
     */
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

    /**
     * Resets the ball to the center and stops its movement.
     * Called after a score or at game restart.
     */
    private resetBall() {
        this.ballSize = { width: 0, height: 0 };
        this.ballPosition = { x: this.canvasSize.width / 2, y: this.canvasSize.height / 2 };
        this.ballVelocity = { x: 0, y: 0 };

        setTimeout(() => {
            this.displayBall();
            this.launchBall();
        }, GameStateService.BALL_LAUNCH_DELAY_MS);
    }

    /**
     * Determines the initial direction and speed of the ball when launched.
     */
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
    }

    /**
     * Displays the ball on the game canvas.
     * Called after a delay following a score or at game start.
     */
    displayBall(): void {
        this.ballSize = { width: 10, height: 10 };
    }

    /**
     * Calculates the angle at which the ball will be launched.
     * @param isGoingRight - Boolean indicating if the ball is going right or left.
     * @param isTopPosition - Boolean indicating if the ball is in the top or bottom half.
     * @returns The angle in radians for the ball's trajectory.
     */
    private calculateBallAngle(isGoingRight: boolean, isTopPosition: boolean): number {
        if (isGoingRight) {
            return isTopPosition ? 3 * Math.PI / 4 : Math.PI / 4;
        } else {
            return isTopPosition ? Math.PI / 4 : 3 * Math.PI / 4;
        }
    }

    /**
     * Updates the score based on the player and increments it by the given value.
     * @param value - The value to increment the score.
     * @param target - The player for whom the score is to be updated.
     */
    private updateScore(value, target: Player) {
        if (target === Player.Player1)
            this.score1 += value;
        else
            this.score2 += value;
        this.checkEndMatch();
    }

    /**
     * Checks if the match has ended based on the scores and calls the end match callback.
     */
    private checkEndMatch() {
        if (this.score1 === GameStateService.WINNING_SCORE) {
            this.endMatch(Player.Player1, EndReason.Score);
            this.resetBallPostMatch();
        } else if (this.score2 === GameStateService.WINNING_SCORE) {
            this.endMatch(Player.Player2, EndReason.Score);
            this.resetBallPostMatch();
        }
    }

    /**
     * Sets a player's status as forfeited and determines the match winner.
     * @param playerID - The ID of the player who forfeited.
     */
    setForfeit(playerID: string | number) {
        if (playerID === this.player1ID) {
            this.endMatch(Player.Player2, EndReason.Forfeit);
        } else if (playerID === this.player2ID) {
            this.endMatch(Player.Player1, EndReason.Forfeit);
        } else {
            throw new Error('BadTargetForfeit');
        }
    }

    /**
     * Ends the match and notifies the end match callback with the result.
     * @param winner - The player who won the match.
     * @param reason - The reason for the match ending (score or forfeit).
     */
    private endMatch(winner: Player, reason: EndReason): void {
        const result: EndMatchResult = {
            winner: winner,
            reason: reason
        };
        this.endMatchCallback(result);
    }

    /**
     * Sets a player's readiness for the game.
     * @param value - The readiness state to set.
     * @param target - The player to update ('player1' or 'player2').
     */
    setReady(value: boolean, target: string) {
        if (target === 'player1') {
            this.playerReady.first = value;
        } else {
            this.playerReady.second = value;
        }
    }

    /**
     * Toggles the base game option for a player.
     * Disables small racket and obstacle options if enabled.
     * @param value - Whether the player wants the base game.
     * @param target - The player to update ('player1' or 'player2').
     */
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

    /**
     * Sets the small racket option for a player.
     * Adjusts the racket size based on the option.
     * @param value - Whether to enable the small racket.
     * @param target - The player to update ('player1' or 'player2').
     */
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

    /**
     * Sets the obstacle option for a player.
     * Positions and sizes the obstacle based on the option.
     * @param value - Whether to enable the obstacle.
     * @param target - The player to update ('player1' or 'player2').
     */
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