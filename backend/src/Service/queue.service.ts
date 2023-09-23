import { Injectable } from '@nestjs/common';
import { AuthenticatedPlayer, PlayerInQueue } from 'src/Model/player.model';

/**
 * The QueueService handles the management of the queue for players waiting for a match.
 */
@Injectable()
export class QueueService {
    private standardQueue: PlayerInQueue[] = [];
    private rankedQueue: AuthenticatedPlayer[] = [];

    /* Standard Queue */
    /**
     * Adds a player to the standard queue.
     * 
     * @param player - The player to be added to the standard queue.
     */
    add(player: PlayerInQueue): void {
        this.standardQueue.push(player);
    }

    /**
     * Removes a player from the standard queue based on their ID.
     * 
     * @param playerId - The ID of the player to be removed from the stab queue.
     */
    remove(data: { playerId: string | number }): void {
        console.log("Standard Queue before removal:", this.standardQueue);
    
        const playerId = data.playerId;
        this.standardQueue = this.standardQueue.filter(player => {
            const isSameId = player.id === playerId;
            if (!isSameId) {
                console.log(`Comparing: ${player.id} (Type: ${typeof player.id}) with ${playerId} (Type: ${typeof playerId})`);
            }
            return !isSameId;
        });
    
        console.log("Standard Queue after removal:", this.standardQueue);
    }

    /**
     * Retrieves the current size of the standard queue.
     * 
     * @returns The number of players currently in the standard queue.
     */
    getQueueSize(): number {
        return this.standardQueue.length;
    }

    /**
     * Getter for the current players waiting in the standard queue.
     * 
     * @returns The array of players in the standard queue.
     */
    getCurrentQueue(): PlayerInQueue[] {
        return this.standardQueue;
    }

    /* Ranked Queue */
    /**
     * Adds a player to the ranked queue.
     * 
     * @param player - The authenticated player to be added to the ranked queue.
     */
    addRanked(player: AuthenticatedPlayer): void {
        this.rankedQueue.push(player);
    }

    /**
     * Removes a player from the ranked queue based on their ID.
     * 
     * @param playerId - The ID of the player to be removed from the ranked queue.
     */
    removeRanked(playerId: number): void {
        this.rankedQueue = this.rankedQueue.filter(player => player.id !== playerId);
    }

    /**
     * Retrieves the current size of the ranked queue.
     * 
     * @returns The number of authenticated players currently in the ranked queue.
     */
    getRankedQueueSize(): number {
        return this.rankedQueue.length;
    }

    /**
     * Getter for the current players waiting in the ranked queue.
     * 
     * @returns The array of players in the ranked queue.
     */
    getCurrentRankedQueue(): AuthenticatedPlayer[] {
        return this.rankedQueue;
    }

    /**
     * Getter for the current players waiting in the ranked queue, sorted by points.
     * 
     * @returns A sorted array of authenticated players, with players having the least points appearing first.
     */
    getSortedRankedQueue(): AuthenticatedPlayer[] {
        return this.rankedQueue.sort((a, b) => a.points - b.points);
    }
}