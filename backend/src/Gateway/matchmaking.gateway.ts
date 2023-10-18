import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { MatchmakingService } from 'src/Service/matchmaking.service';
import { PlayerInQueue, AuthenticatedPlayer } from 'src/Model/player.model';

@WebSocketGateway({ 
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true,
  }
})
export class MatchmakingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly matchmakingService: MatchmakingService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-standard')
  joinQueue(client: Socket, player: PlayerInQueue): void {
    this.matchmakingService.add(player);
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
}
