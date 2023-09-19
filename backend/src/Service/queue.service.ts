import { Injectable } from '@nestjs/common';
import { PlayerInQueue } from 'src/Model/player.model';

/**
 * The QueueService handles the management of the queue for players waiting for a match.
 */
@Injectable()
export class QueueService {
    // An array that represents the current queue of players.
    private queue: PlayerInQueue[] = [];

    /**
     * Adds a player to the end of the queue.
     * 
     * @param player - The player to be added to the queue.
     */
    add(player: PlayerInQueue): void {
        this.queue.push(player);
    }

    /**
     * Removes a player from the queue based on their ID.
     * 
     * @param playerId - The ID of the player to be removed from the queue.
     */
    remove(playerId: number): void {
        this.queue = this.queue.filter(player => player.id !== playerId);
    }

    /**
     * Retrieves the current size of the queue.
     * 
     * @returns The number of players currently in the queue.
     */
    getQueueSize(): number {
        return this.queue.length;
    }

    /**
     * Getter for the current queue of players waiting for a match.
     * 
     * @returns The array of players in the queue.
     */
    get currentQueue(): PlayerInQueue[] {
        return this.queue;
    }

    /**
     * Retrieves the players from the queue and sorts them in ascending order based on their points.
     * 
     * @returns A sorted array of players, with players having the least points appearing first.
     */
    getSortedQueue(): PlayerInQueue[] {
        return this.queue.sort((a, b) => a.points - b.points);
    }
}