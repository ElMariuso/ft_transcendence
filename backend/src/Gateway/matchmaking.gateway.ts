import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';
import { MatchmakingService } from 'src/Service/matchmaking.service';
import { PlayerInQueue, AuthenticatedPlayer } from 'src/Model/player.model';
import { GameGateway } from './game.gateway';
import { MatchmakingStateService } from 'src/Service/matchmakingstate.service';

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
    private onlinePlayers: Map<string, { playerId: number | string; username: string }> = new Map();
    private matchmakingStates: Map<string | number, MatchmakingStateService> = new Map();
    
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
      this.startMatchmakingUpdates();
    }

    /**
     * Handle new client connection.
     * @param client - The connecting socket client.
     */
    async handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`);

      console.log('Connect:', this.onlinePlayers);
    }
    
    /**
     * Handle client disconnection.
     * @param client - The disconnecting socket client.
     */
    async handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
      this.deleteOnlinePlayer(client.id);

      console.log('Disconnect:', this.onlinePlayers);
    }

    /**
     * Handles the 'join-standard' message to add a player to the standard matchmaking queue.
     * @param client - The socket client sending the request.
     * @param player - The player's information to be added to the queue.
     */
    @SubscribeMessage('join-standard')
    joinQueue(client: Socket, player: PlayerInQueue): void {
      console.log("JoinQueue:", player.id);

      this.matchmakingService.add(player);
      this.addOnlinePlayer(client.id, player.id, player.username);
      this.setMatchmakingState(player.id, player.username, false);

      console.log("Join standard:", this.onlinePlayers);

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
      this.deleteMatchmakingState(playerId);
      this.deleteOnlinePlayer(client.id);
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
      this.addOnlinePlayer(client.id, player.id, player.username);
      this.setMatchmakingState(player.id, player.username, true);

      console.log("Join ranked:", this.onlinePlayers);

      client.emit('joined-ranked', { status: 'Added to ranked queue', playerId: player.id });
    }

    /**
     * Handles the 'leave-ranked' message to remove a player from the ranked matchmaking queue.
     * @param client - The socket client sending the request.
     * @param playerId - The ID of the player to be removed from the queue.
     */
    @SubscribeMessage('leave-ranked')
    leaveRankedQueue(client: Socket, playerId: number): void {

      console.log("IDRANKED:", playerId);

      this.matchmakingService.removeRanked(playerId);
      this.deleteMatchmakingState(playerId);
      this.deleteOnlinePlayer(client.id);
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

    @SubscribeMessage('rejoin-matchmaking')
    rejoinMatchmaking(client: Socket, playerId: string | number): void {
      console.log("PlayerID:", playerId);
      if (this.matchmakingStates.has(playerId)) {
        this.logger.log(`Player rejoining matchmaking: ${playerId}`);
        const playerState = this.matchmakingStates.get(playerId);

        this.addOnlinePlayer(client.id, playerId, playerState.username);
        this.sendMatchmakingState(playerId);
      } else {
        this.logger.log(`Player not found in matchmakingStates: ${playerId}`);
      }

      console.log('Rejoin:', this.onlinePlayers);
    }

    /**
     * Handles the event when a standard match is found. Transfers both players to the game session.
     * @param match - The match information containing both players.
     */
    private getStandardMatch(match: { player1: PlayerInQueue, player2: PlayerInQueue }): void {
      this.updateMatchmakingStateForMatchFound(match.player1.id, match.player2);
      this.updateMatchmakingStateForMatchFound(match.player2.id, match.player1);

      setTimeout(() => {
        this.transferPlayerToGame(match.player1.id);
        this.transferPlayerToGame(match.player2.id);
        this.gameGateway.createMatch(match, false);
      }, 5000);
    }

    /**
     * Handles the event when a ranked match is found. Transfers both players to the game session.
     * @param match - The match information containing both players.
     */
    private getRankedMatch(match: { player1: AuthenticatedPlayer, player2: AuthenticatedPlayer }): void {
      this.updateMatchmakingStateForMatchFound(match.player1.id, match.player2);
      this.updateMatchmakingStateForMatchFound(match.player2.id, match.player1);

      setTimeout(() => {
        this.transferPlayerToGame(match.player1.id);
        this.transferPlayerToGame(match.player2.id);
        this.gameGateway.createMatch(match, true);
      }, 5000);
    }

    /**
     * Transfers a player from the matchmaking pool to an active game session.
     * @param playerId - The ID of the player to be transferred.
     */
    private transferPlayerToGame(playerId: number | string): void {
      const playerInfos = this.findPlayerByPlayerId(playerId);
      if (playerInfos) {
        this.sendMatchFoundNotification(playerId);

        this.gameGateway.addOnlinePlayer(playerInfos.clientId, playerInfos.playerInfo);
        this.deleteOnlinePlayer(playerInfos.clientId);
        this.deleteMatchmakingState(playerId);
      } else {
        this.logger.error(`TransferPlayerToGame: Player with ID ${playerId} not found in online players map.`);
      }
    }

    private addOnlinePlayer(clientId: string, sentPlayerId: string | number, sentUsername: string): void {
      this.onlinePlayers.set(clientId, { playerId: sentPlayerId, username: sentUsername });
    }

    private deleteOnlinePlayer(clientId: string): void {
      this.onlinePlayers.delete(clientId);
    }

    private findPlayerByPlayerId(playerId: number | string): { clientId: string; playerInfo: { playerId: number | string; username: string } } | undefined {
      let foundPlayer: { clientId: string; playerInfo: { playerId: number | string; username: string } } | undefined = undefined;

      this.onlinePlayers.forEach((playerInfo, clientId) => {
          if (playerInfo.playerId === playerId) {
              foundPlayer = { clientId, playerInfo };
              return;
          }
      });
      return foundPlayer;
    }

    private setMatchmakingState(playerId: string | number, username: string, isRanked: boolean): void {
      const state = new MatchmakingStateService();
      state.setUsername(username);
      state.setIsSearching(true);
      state.setIsRanked(isRanked);
      this.matchmakingStates.set(playerId, state);
    }

    private deleteMatchmakingState(playerId: string | number): void {
      this.matchmakingStates.delete(playerId);
    }

    private startMatchmakingUpdates(): void {
      setInterval(() => {
          this.matchmakingStates.forEach((_, playerId) => {
              this.sendMatchmakingState(playerId);
          });
      }, 500);
    }

    private sendMatchmakingState(playerId: string | number): void {
      const state = this.matchmakingStates.get(playerId);

      if (!state) {
        this.logger.error('No matchmaking state found for player ID: ${playerId}');
        return ;
      }

      const informations = {
        isSearching: state.isSearching,
        isRanked: state.isRanked,
        matchFound: state.matchFound,
        opponentUUID: state.opponentUUID,
        opponentUsername: state.opponentUsername,
      };

      const playerInfo = this.findPlayerByPlayerId(playerId);
      if (playerInfo) {
        const client = this.server.sockets.sockets.get(playerInfo.clientId);
        if (client) {
          client.emit('matchmaking-informations', informations);
        } else {
          this.logger.error(`No socket found for client ID: ${playerInfo.clientId}`);
        }
      } else {
        this.logger.error(`SendMatchmakingState: Player with ID ${playerId} not found in online players map.`);
      }
    }

    private updateMatchmakingStateForMatchFound(playerId: string | number, opponent: PlayerInQueue | AuthenticatedPlayer): void {
      const state = this.matchmakingStates.get(playerId);
      if (state) {
          state.setMatchFound(true);
          state.setOpponentUUID(opponent.id.toString());
          state.setOpponentUsername(opponent.username);
      }
    }

    private updateMatchmakingStateForGameStart(playerId: number | string): void {
      const state = this.matchmakingStates.get(playerId);
      if (state) {
          state.setIsSearching(false);
          state.setMatchFound(false);
      }
    }

    private sendMatchFoundNotification(playerId: string | number): void {
      this.updateMatchmakingStateForGameStart(playerId);
      this.sendMatchmakingState(playerId);
  
      const playerInfo = this.findPlayerByPlayerId(playerId);
      if (playerInfo && this.server.sockets.sockets.get(playerInfo.clientId)) {
          this.server.sockets.sockets.get(playerInfo.clientId).emit('match-found');
      }
    }
}