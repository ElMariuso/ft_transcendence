import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';
import { MatchmakingService } from 'src/Service/matchmaking.service';
import { PlayerInQueue, AuthenticatedPlayer } from 'src/Model/player.model';
import { GameGateway } from './game.gateway';

/**
 * @WebSocketGateway The gateway for handling all matchmaking related operations.
 * It listens for specific socket events related to standard and ranked matchmaking.
 */
@WebSocketGateway({ 
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"],
    }
})
export class MatchmakingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private logger: Logger = new Logger('MatchmakingGateway');

    /**
     * A map to keep track of online players and their socket IDs.
     */
    private onlinePlayers: Map<number | string, { socketId: string; username: string }> = new Map();
    
    @WebSocketServer() server: Server;
    
    /**
     * Constructor for MatchmakingGateway.
     * @param matchmakingService - The service handling the matchmaking logic.
     * @param gameGateway - The gateway for game-related operations.
     * @param eventEmitter - The EventEmitter for emitting and listening to events.
     */
    constructor(
      private readonly matchmakingService: MatchmakingService,
      private readonly gameGateway: GameGateway,
      private readonly eventEmitter: EventEmitter,
    ) {
      this.eventEmitter.on('match-standard', this.getStandardMatch.bind(this));
      this.eventEmitter.on('match-ranked', this.getRankedMatch.bind(this));
    }

    /**
     * Handle new client connection.
     * @param client - The connecting socket client.
     */
    async handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`);
    }
    
    /**
     * Handle client disconnection.
     * @param client - The disconnecting socket client.
     */
    async handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
      this.onlinePlayers.delete(client.id);
    }

    /**
     * Handles the 'join-standard' message to add a player to the standard matchmaking queue.
     * @param client - The socket client sending the request.
     * @param player - The player's information to be added to the queue.
     */
    @SubscribeMessage('join-standard')
    joinQueue(client: Socket, player: PlayerInQueue): void {
      this.matchmakingService.add(player);
      this.onlinePlayers.set(player.id, { socketId: client.id, username: player.username });
      client.emit('joined', { status: 'Added to standard queue', playerId: player.id });
    }

    /**
     * Handles the 'leave-standard' message to remove a player from the standard matchmaking queue.
     * @param client - The socket client sending the request.
     * @param data - Data containing the playerId to be removed from the queue.
     */
    @SubscribeMessage('leave-standard')
    leaveQueue(client: Socket, data: { playerId: string | number }): void {
      const playerId = data.playerId;
      this.matchmakingService.remove(playerId);
      client.emit('left', { status: 'Removed from standard queue' });
    }

    /**
     * Sends the current status of the standard matchmaking queue to the client.
     * @param client - The socket client requesting the queue status.
     */
    @SubscribeMessage('status-standard')
    getQueueStatus(client: Socket): void {
      client.emit('status', { playersInQueue: this.matchmakingService.getQueueSize() });
    }

    /**
     * Handles the 'join-ranked' message to add a player to the ranked matchmaking queue.
     * @param client - The socket client sending the request.
     * @param player - The authenticated player's information to be added to the queue.
     */
    @SubscribeMessage('join-ranked')
    joinRankedQueue(client: Socket, player: AuthenticatedPlayer): void {
      this.matchmakingService.addRanked(player);
      this.onlinePlayers.set(player.id, { socketId: client.id, username: player.username });
      client.emit('joined-ranked', { status: 'Added to ranked queue', playerId: player.id });
    }

    /**
     * Handles the 'leave-ranked' message to remove a player from the ranked matchmaking queue.
     * @param client - The socket client sending the request.
     * @param playerId - The ID of the player to be removed from the queue.
     */
    @SubscribeMessage('leave-ranked')
    leaveRankedQueue(client: Socket, playerId: number): void {
      this.matchmakingService.removeRanked(playerId);
      client.emit('left-ranked', { status: 'Removed from ranked queue' });
    }

    /**
     * Sends the current status of the ranked matchmaking queue to the client.
     * @param client - The socket client requesting the queue status.
     */
    @SubscribeMessage('status-ranked')
    getRankedQueueStatus(client: Socket): void {
      client.emit('status-ranked', { playersInQueue: this.matchmakingService.getRankedQueueSize() });
    }

    /**
     * Handles the event when a standard match is found. Transfers both players to the game session.
     * @param match - The match information containing both players.
     */
    private getStandardMatch(match: { player1: PlayerInQueue, player2: PlayerInQueue }): void {
      this.transferPlayerToGame(match.player1.id);
      this.transferPlayerToGame(match.player2.id);
      this.gameGateway.createMatch(match, false);
    }

    /**
     * Handles the event when a ranked match is found. Transfers both players to the game session.
     * @param match - The match information containing both players.
     */
    private getRankedMatch(match: { player1: AuthenticatedPlayer, player2: AuthenticatedPlayer }): void {
      this.transferPlayerToGame(match.player1.id);
      this.transferPlayerToGame(match.player2.id);
      this.gameGateway.createMatch(match, true);
    }

    /**
     * Transfers a player from the matchmaking pool to an active game session.
     * @param playerId - The ID of the player to be transferred.
     */
    private transferPlayerToGame(playerId: number | string): void {
      const playerInfo = this.onlinePlayers.get(playerId);
      if (playerInfo) {
        this.gameGateway.addOnlinePlayer(playerId, playerInfo);
        this.onlinePlayers.delete(playerId);
      } else {
        this.logger.error(`Player with ID ${playerId} not found in online players map.`);
      }
    }
}
