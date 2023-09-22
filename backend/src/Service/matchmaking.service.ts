import { Injectable } from '@nestjs/common';
import { Game } from '@prisma/client'
import { QueueService } from './queue.service';
import { PlayerInQueue } from 'src/Model/player.model';
import { GameQuery } from 'src/Query/game.query';

/**
 * Service responsible for managing player matchmaking logic.
 *
 * @export
 * @class MatchmakingService
 */
@Injectable()
export class MatchmakingService {
    /**
     * Creates an instance of MatchmakingService.
     *
     * @param {QueueService} queueService - Service for handling player queue operations.
     * @param {GameQuery} gameQuery - Service for handling game-related database operations.
     */
    constructor(
        private readonly queueService: QueueService,
        private readonly gameQuery: GameQuery
    ) {}

    /**
     * Adds a player to the matchmaking queue.
     *
     * @param {PlayerInQueue} player - The player to be added to the queue.
     * @returns {void}
     */
    add(player: PlayerInQueue): void {
        this.queueService.add(player);
    }

    /**
     * Attempts to find a match for players in the queue. 
     * If a match is found, it creates a new game and removes the matched players from the queue.
     * 
     * Players are matched based on the order they appear in a sorted queue.
     * 
     * @returns {Promise<Game | null>} - Returns the newly created game if a match is found, otherwise null.
     */
    // async match(): Promise<Game | null> {
    //     const sortedQueue = this.queueService.getSortedQueue();

    //     if (sortedQueue.length < 2) {
    //         return null;
    //     }
    //     const player1 = sortedQueue[0];
    //     const player2 = sortedQueue[1];

    //     this.queueService.remove(player1.id);
    //     this.queueService.remove(player2.id);

    //     const newGame = await this.gameQuery.createGame();

    //     return newGame;
    // }

    /**
     * Removes a player from the matchmaking queue.
     *
     * @param {number} playerId - The ID of the player to be removed from the queue.
     * @returns {void}
     */
    remove(playerId: number): void {
        this.queueService.remove(playerId);
    }

    /**
     * Retrieves the current number of players in the queue.
     * @returns {number} The number of players in the queue.
     */
    getQueueSize(): number {
        return this.queueService.getQueueSize();
    }
}