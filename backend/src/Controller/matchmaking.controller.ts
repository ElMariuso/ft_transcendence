import { Controller, Get, Post, Body } from '@nestjs/common';
import { MatchmakingService } from 'src/Service/matchmaking.service';
import { AuthenticatedPlayer, PlayerInQueue } from 'src/Model/player.model';

import { v4 as uuidv4 } from 'uuid';

/**
 * The MatchmakingController handles routes associated with player matchmaking.
 * It allows players to join or leave both standard and ranked queues and provides 
 * insights about the current state of each queue.
 *
 * @author [mthiry]
 * @version 0.0.2
 */
@Controller('matchmaking')
export class MatchmakingController {
    constructor(private readonly matchmakingService: MatchmakingService) {}

    /**
     * Adds a player to the standard matchmaking queue. If the player is a guest,
     * a unique ID will be generated for them.
     *
     * @param player - Details of the player to be added to the queue.
     * @returns An object indicating the status of the operation and the player's ID.
     */
    @Post('join')
    joinQueue(@Body() player: PlayerInQueue) {
        console.log("Before ID assignment:", player);

        if (player.isGuest) {
            player.id = uuidv4();
            console.log("After ID assignment:", player);
        }

        console.log("Status on Join: ", this.matchmakingService.getQueueSize());

        this.matchmakingService.add(player);
        return { status: 'Added to standard queue', playerId: player.id };
    }

    /**
     * Removes a player from the standard matchmaking queue based on their ID.
     *
     * @param playerId - The ID of the player to be removed from the standard queue.
     * @returns An object indicating the status of the operation.
     */
    @Post('leave')
    leaveQueue(@Body() playerId: string | number) {

        console.log("Id to remove: ", playerId);

        this.matchmakingService.remove(playerId);

        console.log("Status on Leave: ", this.matchmakingService.getQueueSize());

        return { status: 'Removed from standard queue' };
    }

    /**
     * Retrieves the current status of the standard matchmaking queue. This returns
     * the number of players currently waiting in the standard queue.
     *
     * @returns An object detailing the number of players in the standard queue.
     */
    @Get('status')
    getQueueStatus() {
        return { playersInQueue: this.matchmakingService.getQueueSize() };
    }

    /**
     * Adds a player to the ranked matchmaking queue.
     *
     * @param player - Details of the authenticated player to be added to the ranked queue.
     * @returns An object indicating the status of the operation and the player's ID.
     */
    @Post('join-ranked')
    joinRankedQueue(@Body() player: AuthenticatedPlayer) {
        this.matchmakingService.addRanked(player);
        return { status: 'Added to ranked queue', playerId: player.id };
    }

    /**
     * Removes a player from the ranked matchmaking queue based on their ID.
     *
     * @param playerId - The ID of the player to be removed from the ranked queue.
     * @returns An object indicating the status of the operation.
     */
    @Post('leave-ranked')
    leaveRankedQueue(@Body() playerId: number) {
        this.matchmakingService.removeRanked(playerId);
        return { status: 'Removed from ranked queue' };
    }

    /**
     * Retrieves the current status of the ranked matchmaking queue. This returns
     * the number of players currently waiting in the ranked queue.
     *
     * @returns An object detailing the number of players in the ranked queue.
     */
    @Get('status-ranked')
    getRankedQueueStatus() {
        return { playersInQueue: this.matchmakingService.getRankedQueueSize() };
    }
}