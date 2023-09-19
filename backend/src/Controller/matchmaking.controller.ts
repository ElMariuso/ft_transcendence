import { Controller, Get, Post, Body } from '@nestjs/common';
import { MatchmakingService } from 'src/Service/matchmaking.service';
import { PlayerInQueue } from 'src/Model/player.model';

/**
 * The MatchmakingController handles routes associated with player matchmaking.
 * It enables players to join or leave a queue and also provides insights 
 * about the current state of the queue.
 *
 * @author [mthiry]
 * @version 0.0.1
 */
@Controller('matchmaking')
export class MatchmakingController {
    constructor(private readonly matchmakingService: MatchmakingService) {}

    /**
     * Adds a player to the matchmaking queue.
     *
     * @param player - Details of the player to be added to the queue.
     * @returns An object indicating the status of the operation.
     */
    @Post('join')
    joinQueue(@Body() player: PlayerInQueue) {
        this.matchmakingService.add(player);
        return { status: 'Added to queue' };
    }

    /**
     * Removes a player from the matchmaking queue based on their ID.
     *
     * @param playerId - The ID of the player to be removed from the queue.
     * @returns An object indicating the status of the operation.
     */
    @Post('leave')
    leaveQueue(@Body() playerId: number) {
        this.matchmakingService.remove(playerId);
        return { status: 'Removed from queue' };
    }

    /**
     * Gets the current status of the matchmaking queue. This notably returns
     * the number of players currently waiting.
     *
     * @returns An object detailing the number of players in the queue.
     */
    @Get('status')
    getQueueStatus() {
        return { playersinQueue: this.matchmakingService.getQueueSize() };
    }

}