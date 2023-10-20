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
  private onlinePlayers: Map<number | string, { socketId: string; username: string }> = new Map();
  private clientRooms: Map<string, string> = new Map();

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

    const roomId = this.findRoomIdByClientId(client.id);

    if (roomId) {
      client.leave(roomId);
      console.log(`Client ${client.id} removed from room ${roomId}`);
      this.server.to(roomId).emit('user-disconnected', { clientId: client.id, roomId });
    }
    this.onlinePlayers.delete(client.id);
    this.clientRooms.delete(client.id);
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
  
  @SubscribeMessage('quit-standard')
  quitStandardMatch(client: Socket): void {
        const roomId = this.findRoomIdByClientId(client.id);
        if (roomId) {
          client.leave(roomId);
          client.emit('left-room', { status: 'You have left the standard match room', roomId });
        } else {
          client.emit('error', { status: 'Error leaving room or room not found' });
        }
  }

  @SubscribeMessage('quit-ranked')
  quitRankedMatch(client: Socket): void {
    const roomId = this.findRoomIdByClientId(client.id);
    if (roomId) {
      client.leave(roomId);
      client.emit('left-room', { status: 'You have left the ranked match room', roomId });
    } else {
      client.emit('error', { status: 'Error leaving room or room not found' });
    }
  }

  @SubscribeMessage('rejoin-room')
  rejoinRoom(client: Socket, data: { roomId: string, username: string}): void {
    const roomId = data.roomId;
    const username = data.username;
    const room = this.server.sockets.adapter.rooms.get(roomId);
    
    if (room) {
      client.join(roomId);
      client.emit('rejoined-room', { status: 'Rejoined the room', roomId });

      this.clientRooms.set(client.id, roomId);
      this.onlinePlayers.set(client.id, { socketId: client.id, username: username });
    } else {
      client.emit('rejoin-failed', { status: 'Failed to rejoin the room', roomId });
    }
  }

  @SubscribeMessage('update-racket')
  updateRacket(client: Socket, data: string): void {
    const roomId = this.findRoomIdByClientId(client.id);

    if (roomId) {
      client.broadcast.to(roomId).emit('racket-update', data);
    } else {
      client.emit('error', { status: 'Error finding room or room not found' });
    }
  }

  private getStandardMatch(match: { player1: PlayerInQueue, player2: PlayerInQueue }): void {
    const player1Info = this.onlinePlayers.get(match.player1.id);
    const player2Info = this.onlinePlayers.get(match.player2.id);
    const roomId = uuidv4();

    if (player1Info && player2Info) {
      this.server.sockets.sockets.get(player1Info.socketId)?.join(roomId);
      this.server.sockets.sockets.get(player2Info.socketId)?.join(roomId);

      this.clientRooms.set(player1Info.socketId, roomId);
      this.clientRooms.set(player2Info.socketId, roomId);

      this.server.to(roomId).emit('match-found-standard', { 
        player1: { id: match.player1.id, username: player1Info.username }, 
        player2: { id: match.player2.id, username: player2Info.username }, 
        roomId 
      });
    }
  }

  private getRankedMatch(match: { player1: AuthenticatedPlayer, player2: AuthenticatedPlayer }): void {
    const player1Info = this.onlinePlayers.get(match.player1.id);
    const player2Info = this.onlinePlayers.get(match.player2.id);
    const roomId = uuidv4();

    if (player1Info && player2Info) {
      this.server.sockets.sockets.get(player1Info.socketId)?.join(roomId);
      this.server.sockets.sockets.get(player2Info.socketId)?.join(roomId);

      this.clientRooms.set(player1Info.socketId, roomId);
      this.clientRooms.set(player2Info.socketId, roomId);

      this.server.to(roomId).emit('match-found-ranked', { 
        player1: { id: match.player1.id, username: player1Info.username }, 
        player2: { id: match.player2.id, username: player2Info.username }, 
        roomId 
      });
    }
  }

  private findRoomIdByClientId(clientId: string): string | undefined {
    return this.clientRooms.get(clientId);
  }
}
