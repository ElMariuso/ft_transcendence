import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { MatchmakingService } from 'src/Service/matchmaking.service';
import { PlayerInQueue, AuthenticatedPlayer } from 'src/Model/player.model';

@WebSocketGateway({ 
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  }
})
export class MatchmakingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private onlinePlayers: Map<number | string, string> = new Map();

  constructor(
    private readonly matchmakingService: MatchmakingService,
    private readonly eventEmitter: EventEmitter,
  ) {
    this.eventEmitter.on('match-standard', this.getStandardMatch.bind(this));
    this.eventEmitter.on('match-ranked', this.getRankedMatch.bind(this));
  }

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MatchmakingGateway');

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-standard')
  joinQueue(client: Socket, player: PlayerInQueue): void {
    this.matchmakingService.add(player);
    this.onlinePlayers.set(player.id, client.id);
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
    this.onlinePlayers.set(player.id, client.id);
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
    const player1SocketId = this.onlinePlayers.get(match.player1.id);
    const player2SocketId = this.onlinePlayers.get(match.player2.id);
    const roomId = uuidv4();

    if (player1SocketId && player2SocketId) {
      this.server.sockets.sockets.get(player1SocketId)?.join(roomId);
      this.server.sockets.sockets.get(player2SocketId)?.join(roomId);

      this.server.to(roomId).emit('match-found-standard', { ...match, roomId });
    }
  }

  private getRankedMatch(match: { player1: AuthenticatedPlayer, player2: AuthenticatedPlayer }): void {
    const player1SocketId = this.onlinePlayers.get(match.player1.id);
    const player2SocketId = this.onlinePlayers.get(match.player2.id);
    const roomId = uuidv4();

    if (player1SocketId && player2SocketId) {
      this.server.sockets.sockets.get(player1SocketId)?.join(roomId);
      this.server.sockets.sockets.get(player2SocketId)?.join(roomId);

      this.server.to(roomId).emit('match-found-ranked', { ...match, roomId });
    }
  }
}
