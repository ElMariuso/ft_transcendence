import { Injectable, Logger } from '@nestjs/common';
import { GameStateService } from './gamestate.service';

@Injectable()
export class GameLoopService {
    private readonly logger = new Logger(GameLoopService.name);

    // Interval object for the game loop, allowing it to be cleared when needed.
    private gameLoopInterval: NodeJS.Timeout | null = null;

    // The tick rate for the game loop (number of updates per second).
    private readonly TICK_RATE = 1000 / 120;

    constructor(private readonly gameStateService: GameStateService) {}

    /**
     * Starts the game loop if both players are ready.
     * Sets an interval that updates the game state at the defined tick rate.
     */
    startGameLoop(): void {
        if (this.gameStateService.playerReady.first && this.gameStateService.playerReady.second) {
            this.gameStateService.displayBall();
            this.gameLoopInterval = setInterval(() => {
                this.gameTick();
            }, this.TICK_RATE);
            this.logger.log('Game loop started');
        }
    }

    /**
     * Stops the game loop by clearing the interval.
     * This is typically called when a game ends or is paused.
     */
    stopGameLoop(): void {
        clearInterval(this.gameLoopInterval);
        this.logger.log('Game loop stopped');
    }

    /**
     * Returns the current game state.
     * Useful for retrieving game data outside of the game loop.
     */
    getGameState() {
        return this.gameStateService;
    }

    /**
     * A single tick of the game loop.
     * Updates the ball position and handles any potential errors.
     */
    private gameTick(): void {
        try {
          this.gameStateService.updateBallPosition();
        } catch (error) {
            this.logger.error(`Error during game tick: ${error.message}`);
        }
    }
}