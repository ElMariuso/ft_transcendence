import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';
import { MatchmakingService } from 'src/Service/matchmaking.service';
import { PlayerInQueue, AuthenticatedPlayer } from 'src/Model/player.model';
import { GameGateway } from './game.gateway';
import { MatchmakingStateService } from 'src/Service/matchmakingstate.service';

interface PlayerInfo {
  playerId: number;
  socketId: string;
  username: string;
}

/**
 * @WebSocketGateway The gateway for handling all matchmaking related operations.
 * It listens for specific socket events related to standard and ranked matchmaking.
 * 
 * This class manages the player connections, matchmaking queues, and transitions players
 * from matchmaking to game sessions. It integrates closely with MatchmakingService and GameGateway
 * to provide a seamless experience.
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
    private challenges: Map<number, number> = new Map();
    private acceptedChallenges: Map<number, { opponentInfo: PlayerInfo, challengerInfo: PlayerInfo, isReady: { [playerId: number]: boolean } }> = new Map();
    
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
     * Handles new client connections. Logs the connection event and performs any necessary setup.
     * @param client - The connecting socket client.
     */
    async handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`);
    }
    
    /**
     * Handles client disconnections. Logs the disconnection event and cleans up any related resources.
     * @param client - The disconnecting socket client.
     */
    async handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
      this.deleteOnlinePlayer(client.id);

      for (const [challengerId, challengeInfo] of this.acceptedChallenges.entries()) {
        if (challengeInfo.challengerInfo.socketId === client.id) {
          challengeInfo.challengerInfo.socketId = null;
          challengeInfo.challengerInfo.username = null;
          challengeInfo.isReady[challengeInfo.challengerInfo.playerId] = false;
        } else if (challengeInfo.opponentInfo.socketId === client.id) {
          challengeInfo.opponentInfo.socketId = null;
          challengeInfo.opponentInfo.username = null;
          challengeInfo.isReady[challengeInfo.opponentInfo.playerId] = false;
        }
      }
    }

    @SubscribeMessage('challenge')
    askChallenge(client: Socket, [playerId, opponentId]: [number, number]) {
      this.challenges.set(playerId, opponentId);

      setTimeout(() => {
        if (this.challenges.has(playerId)) {
            this.logger.log(`Challenge expired: ${playerId}`);
            this.challenges.delete(playerId);
        }
    }, 120000);
    }

    @SubscribeMessage('challenge-answer')
    handleChallengeAnswer(client: Socket, [challengerId, opponentId, answer]: [number, number, number]) {
      if (this.challenges.has(challengerId)) {
        const challengedOpponentId = this.challenges.get(challengerId);

        if (challengedOpponentId === opponentId) {
          if (answer === 0) {
            this.challenges.delete(challengerId);
          } else if (answer === 1) {
            const challengerInfo: PlayerInfo = {
              playerId: challengerId,
              socketId: null,
              username: null
            };
            const opponentInfo: PlayerInfo = {
              playerId: opponentId,
              socketId: null,
              username: null
            };

            this.acceptedChallenges.set(challengerId, { 
              opponentInfo,
              challengerInfo,
              isReady: { [challengerId]: false, [opponentId]: false }
            });
            this.challenges.delete(challengerId);
          }
        }
      }
    }

    @SubscribeMessage('confirm-challenge')
    confirmChallenge(client: Socket, [playerId, playerUsername]: [number, string]) {
      for (const [challengerId, challengeInfo] of this.acceptedChallenges.entries()) {
        let bothReady = false;

        if (challengeInfo.challengerInfo.playerId === playerId) {
          challengeInfo.challengerInfo.socketId = client.id;
          challengeInfo.challengerInfo.username = playerUsername;
          challengeInfo.isReady[playerId] = true;
          bothReady = challengeInfo.isReady[challengeInfo.opponentInfo.playerId];
        } else if (challengeInfo.opponentInfo.playerId === playerId) {
          challengeInfo.opponentInfo.socketId = client.id;
          challengeInfo.opponentInfo.username = playerUsername;
          challengeInfo.isReady[playerId] = true;
          bothReady = challengeInfo.isReady[challengeInfo.challengerInfo.playerId];
        }

        if (bothReady) {
          const player1: AuthenticatedPlayer = {
            id: challengeInfo.challengerInfo.playerId,
            isGuest: false,
            points: 0,
            username: challengeInfo.challengerInfo.username 
          };
          const player2: AuthenticatedPlayer = {
            id: challengeInfo.opponentInfo.playerId,
            isGuest: false,
            points: 0,
            username: challengeInfo.opponentInfo.username
          };
          const player1Info = {
            playerId: player1.id,
            username: player1.username
          };
          const player2Info = {
            playerId: player2.id,
            username: player2.username
          };
          this.gameGateway.addOnlinePlayer(challengeInfo.challengerInfo.socketId, player1Info);
          this.gameGateway.addOnlinePlayer(challengeInfo.opponentInfo.socketId, player2Info);
          this.gameGateway.createMatch({ player1, player2}, false);
          this.acceptedChallenges.delete(challengerId);
        }
        break ;
      }
    }

    @SubscribeMessage('accepted-challenge-state')
    sendAcceptedChallengeState(client: Socket, playerId: number) {
      let acceptedChallengeState = {
        isReady: {},
        opponentId: -1
      };

      for (const [challengerId, challengeInfo] of this.acceptedChallenges.entries()) {
        if (challengeInfo.challengerInfo.playerId === playerId || challengeInfo.opponentInfo.playerId === playerId) {
          acceptedChallengeState = {
            isReady: challengeInfo.isReady,
            opponentId: challengeInfo.opponentInfo.playerId
          };
          break ;
        }
      }
      client.emit('accepted-challenge-state-response', acceptedChallengeState);
    }

    @SubscribeMessage('challenge-state')
    sendChallengeState(client: Socket, [askerId, friendId]: [number, number]) {
      let challengeState = {
        isChallengePending: false,
        challengerId: -1,
        opponentId: -1
      };

      if (askerId === friendId)
        return ;
      if (this.challenges.has(askerId) && this.challenges.get(askerId) === friendId) {
        challengeState = {
          isChallengePending: true,
          challengerId: askerId,
          opponentId: friendId
        };
      }
      else if (this.challenges.has(friendId) && this.challenges.get(friendId) === askerId) {
        challengeState = {
          isChallengePending: true,
          challengerId: friendId,
          opponentId: askerId
        };
      }
      else {
        challengeState = {
          isChallengePending: false,
          challengerId: friendId,
          opponentId: askerId
        };
        client.emit('challenge-state-response', challengeState);
        challengeState = {
          isChallengePending: false,
          challengerId: askerId,
          opponentId: friendId
        };
      }
      client.emit('challenge-state-response', challengeState);
    }

    /**
     * Handles the 'join-standard' message to add a player to the standard matchmaking queue.
     * @param client - The socket client sending the request.
     * @param player - The player's information to be added to the queue.
     */
    @SubscribeMessage('join-standard')
    joinQueue(client: Socket, player: PlayerInQueue): void {
      if (this.isPlayerAlreadyInQueue(player.id)) {
        this.logger.error(`Player ${player.id} already in standard queue.`);
        client.emit('matchmaking-error', { message: 'Already in queue' });
        return;
      }
      this.matchmakingService.add(player);
      this.addOnlinePlayer(client.id, player.id, player.username);
      this.setMatchmakingState(player.id, player.username, false);
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
      if (this.isPlayerAlreadyInQueue(player.id)) {
        this.logger.error(`Player ${player.id} already in ranked queue.`);
        client.emit('error-matchmaking', { message: 'Already in queue' });
        return;
      }
      this.matchmakingService.addRanked(player);
      this.addOnlinePlayer(client.id, player.id, player.username);
      this.setMatchmakingState(player.id, player.username, true);
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

    /**
     * Rejoins a player into the matchmaking process, restoring their state.
     * This is useful in cases where the client might have disconnected and reconnected.
     * @param client - The socket client sending the request.
     * @param playerId - The ID of the player rejoining matchmaking.
     */
    @SubscribeMessage('rejoin-matchmaking')
    rejoinMatchmaking(client: Socket, playerId: string | number): void {
      if (this.matchmakingStates.has(playerId)) {
        this.logger.log(`Player rejoining matchmaking: ${playerId}`);
        const playerState = this.matchmakingStates.get(playerId);
        this.addOnlinePlayer(client.id, playerId, playerState.username);
        this.sendMatchmakingState(playerId);
      } else {
        this.logger.log(`Player not found in matchmakingStates: ${playerId}`);
      }
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

    /**
     * Adds a player to the online players map, tracking their current state in the matchmaking process.
     * @param clientId - The client ID associated with the player.
     * @param sentPlayerId - The player's unique ID.
     * @param sentUsername - The player's username.
     */
    private addOnlinePlayer(clientId: string, sentPlayerId: string | number, sentUsername: string): void {
      this.onlinePlayers.set(clientId, { playerId: sentPlayerId, username: sentUsername });
    }

    /**
     * Removes a player from the online players map when they disconnect or leave the matchmaking process.
     * @param clientId - The client ID associated with the player.
     */
    private deleteOnlinePlayer(clientId: string): void {
      this.onlinePlayers.delete(clientId);
    }

    /**
     * Finds a player by their player ID in the online players map.
     * Returns an object containing the client ID and player info if found, or undefined if not.
     * @param playerId - The ID of the player to find.
     * @return The player's client and info, or undefined if not found.
     */
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

    /**
     * Sets the matchmaking state for a specific player.
     * Initializes a new MatchmakingStateService instance and updates the matchmaking states map.
     * @param playerId - The ID of the player.
     * @param username - The username of the player.
     * @param isRanked - Boolean indicating whether the player is in ranked matchmaking.
     */
    private setMatchmakingState(playerId: string | number, username: string, isRanked: boolean): void {
      const state = new MatchmakingStateService();
      state.setUsername(username);
      state.setIsSearching(true);
      state.setIsRanked(isRanked);
      this.matchmakingStates.set(playerId, state);
    }

    /**
     * Deletes the matchmaking state for a specific player.
     * Removes the player's state from the matchmaking states map.
     * @param playerId - The ID of the player whose matchmaking state is to be deleted.
     */
    private deleteMatchmakingState(playerId: string | number): void {
      this.matchmakingStates.delete(playerId);
    }

    /**
     * Starts periodic updates for matchmaking states.
     * Sends the current matchmaking state to each player at regular intervals.
     */
    private startMatchmakingUpdates(): void {
      setInterval(() => {
          this.matchmakingStates.forEach((_, playerId) => {
              this.sendMatchmakingState(playerId);
          });
      }, 500);
    }

    /**
     * Sends the current matchmaking state to a specific player.
     * Emits matchmaking information to the client if the player is found in the online players map.
     * @param playerId - The ID of the player to send the matchmaking state to.
     */
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

    /**
     * Updates the matchmaking state when a match is found for a player.
     * Sets the matchFound flag and stores the opponent's information in the state.
     * @param playerId - The ID of the player for whom the match was found.
     * @param opponent - The player information of the opponent.
     */
    private updateMatchmakingStateForMatchFound(playerId: string | number, opponent: PlayerInQueue | AuthenticatedPlayer): void {
      const state = this.matchmakingStates.get(playerId);
      if (state) {
          state.setMatchFound(true);
          state.setOpponentUUID(opponent.id.toString());
          state.setOpponentUsername(opponent.username);
      }
    }

    /**
     * Updates the matchmaking state to reflect the start of a game.
     * Marks the player as no longer searching and resets the matchFound flag.
     * @param playerId - The ID of the player whose game is starting.
     */
    private updateMatchmakingStateForGameStart(playerId: number | string): void {
      const state = this.matchmakingStates.get(playerId);
      if (state) {
          state.setIsSearching(false);
          state.setMatchFound(false);
      }
    }

    /**
     * Sends a match found notification to a specific player.
     * Updates the matchmaking state for game start and emits a 'match-found' event to the player.
     * @param playerId - The ID of the player to notify about the match found.
     */
    private sendMatchFoundNotification(playerId: string | number): void {
      this.updateMatchmakingStateForGameStart(playerId);
      this.sendMatchmakingState(playerId);
  
      const playerInfo = this.findPlayerByPlayerId(playerId);
      if (playerInfo && this.server.sockets.sockets.get(playerInfo.clientId)) {
          this.server.sockets.sockets.get(playerInfo.clientId).emit('match-found');
      }
    }

    /**
     * Determines if a player is already in the matchmaking queue.
     * This is to prevent players from joining the queue multiple times.
     * @param playerId - The ID of the player to check.
     * @return boolean - True if the player is already in queue, false otherwise.
     */
    private isPlayerAlreadyInQueue(playerId: number | string): boolean {
      return Array.from(this.onlinePlayers.values()).some(player => player.playerId === playerId);
  }
}