import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';
import { MatchmakingService } from 'src/Service/matchmaking.service';
import { PlayerInQueue, AuthenticatedPlayer } from 'src/Model/player.model';
import { GameGateway } from './game.gateway';

@WebSocketGateway({ 
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"],
    }
})
export class MatchmakingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private logger: Logger = new Logger('MatchmakingGateway');
    private onlinePlayers: Map<number | string, { socketId: string; username: string }> = new Map();
    
    @WebSocketServer() server: Server;
    
    constructor(
      private readonly matchmakingService: MatchmakingService,
      private readonly gameGateway: GameGateway,
      private readonly eventEmitter: EventEmitter,
    ) {
      this.eventEmitter.on('match-standard', this.getStandardMatch.bind(this));
      this.eventEmitter.on('match-ranked', this.getRankedMatch.bind(this));
    }

    async handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`);
    }
    
    async handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
      this.onlinePlayers.delete(client.id);
    }

    @SubscribeMessage('join-standard')
    joinQueue(client: Socket, player: PlayerInQueue): void {
      this.matchmakingService.add(player);
      this.onlinePlayers.set(player.id, { socketId: client.id, username: player.username });
      client.emit('joined', { status: 'Added to standard queue', playerId: player.id });
    }

    @SubscribeMessage('leave-standard')
    leaveQueue(client: Socket, data: { playerId: string | number }): void {
      const playerId = data.playerId;
      this.matchmakingService.remove(playerId);
      client.emit('left', { status: 'Removed from standard queue' });
    }

    @SubscribeMessage('status-standard')
    getQueueStatus(client: Socket): void {
      client.emit('status', { playersInQueue: this.matchmakingService.getQueueSize() });
    }

    @SubscribeMessage('join-ranked')
    joinRankedQueue(client: Socket, player: AuthenticatedPlayer): void {
      this.matchmakingService.addRanked(player);
      this.onlinePlayers.set(player.id, { socketId: client.id, username: player.username });
      client.emit('joined-ranked', { status: 'Added to ranked queue', playerId: player.id });
    }

    @SubscribeMessage('leave-ranked')
    leaveRankedQueue(client: Socket, playerId: number): void {
      this.matchmakingService.removeRanked(playerId);
      client.emit('left-ranked', { status: 'Removed from ranked queue' });
    }

    @SubscribeMessage('status-ranked')
    getRankedQueueStatus(client: Socket): void {
      client.emit('status-ranked', { playersInQueue: this.matchmakingService.getRankedQueueSize() });
    }

    private getStandardMatch(match: { player1: PlayerInQueue, player2: PlayerInQueue }): void {
      this.transferPlayerToGame(match.player1.id);
      this.transferPlayerToGame(match.player2.id);
      this.gameGateway.createMatch(match, false);
    }

    private getRankedMatch(match: { player1: AuthenticatedPlayer, player2: AuthenticatedPlayer }): void {
      this.transferPlayerToGame(match.player1.id);
      this.transferPlayerToGame(match.player2.id);
      this.gameGateway.createMatch(match, true);
    }

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
