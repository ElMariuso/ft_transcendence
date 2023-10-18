import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { Game } from '@prisma/client'
import { QueueService } from './queue.service';
import { AuthenticatedPlayer, PlayerInQueue } from 'src/Model/player.model';
import { GameQuery } from 'src/Query/game.query';

/**
 * Service responsible for managing the matchmaking logic for players.
 * It handles adding and removing players to and from standard and ranked queues,
 * performs matchmaking, and emits events when a match is found.
 *
 * @export
 * @class MatchmakingService
 */
@Injectable()
export class MatchmakingService {
    private matchmakingInterval: NodeJS.Timeout;

    /**
     * Creates an instance of MatchmakingService.
     * This service is responsible for matchmaking players for games.
     *
     * @param {QueueService} queueService - Service for managing player queue operations.
     * @param {GameQuery} gameQuery - Service for handling game-related database operations.
     * @param {EventEmitter} eventEmitter - Event handler for emitting events within the application.
     */
    constructor(
        private readonly queueService: QueueService,
        private readonly gameQuery: GameQuery,
        private readonly eventEmitter: EventEmitter,
    ) {
        this.startMatchmakingInterval();
    }

    /**
     * Adds a player to the standard matchmaking queue. Both guest and authenticated
     * players can join the standard queue.
     *
     * @param {PlayerInQueue} player - The player to be added to the standard queue.
     * @returns {void}
     */
    add(player: PlayerInQueue): void {
        this.queueService.add(player);
    }

    /**
     * Adds an authenticated player to the ranked matchmaking queue. Only authenticated
     * players can join the ranked queue.
     *
     * @param {AuthenticatedPlayer} player - The authenticated player to be added to the ranked queue.
     * @returns {void}
     */
    addRanked(player: AuthenticatedPlayer): void {
        this.queueService.addRanked(player);
    }

    /**
     * Removes a player, either guest or authenticated, from the standard matchmaking queue.
     *
     * @param {string | number} playerId - The ID of the player to be removed from the standard queue. Can be a string for guests or a number for authenticated players.
     * @returns {void}
     */
    remove(playerId: string | number): void {
        this.queueService.remove( playerId );
    }

    /**
     * Removes an authenticated player from the ranked matchmaking queue.
     *
     * @param {number} playerId - The ID of the authenticated player to be removed from the ranked queue.
     * @returns {void}
     */
    removeRanked(playerId: number): void {
        this.queueService.removeRanked(playerId);
    }

    /**
     * Attempts to match two players from the standard queue.
     * 
     * If a match is found, it returns the matched players and removes them from the queue.
     * If not enough players are available in the queue, null is returned.
     *
     * @returns {Promise<{ player1: PlayerInQueue, player2: PlayerInQueue } | null>} - Returns the matched players or null if no match is found.
     */
    async match(): Promise<{ player1: PlayerInQueue, player2: PlayerInQueue } | null> {
        const queue = this.queueService.getCurrentQueue();
    
        if (queue.length < 2) {
            return null;
        }
        
        const player1 = queue[0];
        const player2 = queue[1];
    
        this.queueService.remove(player1.id);
        this.queueService.remove(player2.id);
    
        return { player1, player2 };
    }    

    /**
     * Attempts to find a ranked match for players in the queue based on their points.
     * 
     * If a match is found, it creates a new game in the database and removes the matched players from the queue.
     * If not enough players are available in the queue, null is returned.
     *
     * @returns {Promise<{ player1: AuthenticatedPlayer, player2: AuthenticatedPlayer } | null>} - Returns the matched players or null if no match is found.
     */
    async rankedMatch(): Promise<{ player1: AuthenticatedPlayer, player2: AuthenticatedPlayer } | null> {
        const sortedQueue = this.queueService.getSortedRankedQueue();

        if (sortedQueue.length < 2) {
            return null;
        }
        const player1 = sortedQueue[0];
        const player2 = sortedQueue[1];

        this.queueService.removeRanked(player1.id);
        this.queueService.removeRanked(player2.id);

        const newGame = await this.gameQuery.createGame();

        return { player1, player2 };
    }

    /**
     * Retrieves the current number of players, either guest or authenticated, in the standard matchmaking queue.
     *
     * @returns {number} The number of players in the standard queue.
     */
    getQueueSize(): number {
        return this.queueService.getQueueSize();
    }

    /**
     * Retrieves the current number of authenticated players in the ranked matchmaking queue.
     *
     * @returns {number} The number of authenticated players in the ranked queue.
     */
    getRankedQueueSize(): number {
        return this.queueService.getRankedQueueSize();
    }

    /**
     * Initiates the matchmaking interval to repeatedly attempt player matching.
     * This method sets up an interval to check the queue every 5 seconds for potential matches.
     * If a match is found, additional actions may be taken, such as starting a game.
     * It also emits corresponding events when a standard or ranked match is found.
     * 
     * @private
     * @returns {void}
     */
    private startMatchmakingInterval(): void {
        this.matchmakingInterval = setInterval(async () => {
            let match = await this.match();
            let ranked_match = await this.rankedMatch();
            while (match) {
                this.eventEmitter.emit('match-standard', match);
                match = await this.match();
            }
            while (ranked_match) {
                this.eventEmitter.emit('match-ranked', match);
                ranked_match = await this.rankedMatch();
            }
        }, 5000);
    }

    /**
     * Stops the matchmaking interval. This method clears the matchmaking interval,
     * ensuring no further attempts at matching are made.
     * 
     * @private
     * @returns {void}
     */
    private stopMatchmakingInterval(): void {
        clearInterval(this.matchmakingInterval);
    }

    /**
     * Lifecycle hook that gets called when the module is destroyed.
     * Useful for cleanup purposes, in this case, to clear the matchmaking interval.
     * 
     * @returns {void}
     */
    onModuleDestroy(): void {
        this.stopMatchmakingInterval();
    }
}