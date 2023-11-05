import { Injectable, Logger } from '@nestjs/common';
import { GameStateService } from './gamestate.service';

@Injectable()
export class GameLoopService {
    private readonly logger = new Logger(GameLoopService.name);
    private gameLoopInterval: NodeJS.Timeout | null = null;
    private readonly TICK_RATE = 1000 / 120;

    constructor(private readonly gameStateService: GameStateService) {}

    startGameLoop(): void {
        if (this.gameStateService.playerReady.first && this.gameStateService.playerReady.second) {
            this.gameLoopInterval = setInterval(() => {
                this.gameTick();
            }, this.TICK_RATE);
            this.logger.log('Game loop started');
        }
    }

    stopGameLoop(): void {
        clearInterval(this.gameLoopInterval);
        this.logger.log('Game loop stopped');
    }

    getGameState() {
        return this.gameStateService;
    }

    private gameTick(): void {
        try {
          this.gameStateService.updateBallPosition();
        } catch (error) {
            this.logger.error(`Error during game tick: ${error.message}`);
        }
    }
}