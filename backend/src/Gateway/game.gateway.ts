import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { GameLoopService } from 'src/Service/gameloop.service';
import { GameStateService } from 'src/Service/gamestate.service';
import { Player, Direction, EndMatchResult, GameState } from 'src/Model/gamestate.model';
import { PlayerInQueue } from 'src/Model/player.model';
import { GameService } from 'src/Service/game.service';
import { CreateGameDTO } from 'src/DTO/game/createGame.dto';
import { v4 as uuidv4 } from 'uuid';

/**
 * The GameGateway handles WebSocket connections for game-related interactions.
 * It manages player connections, disconnections, and the orchestration of game states.
 */
@WebSocketGateway({ 
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
    }
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private onlinePlayers: Map<string, { playerId: number | string; username: string }> = new Map();
    private clientRooms: Map<string, string> = new Map();
    private gameStates: Map<string, GameLoopService> = new Map();
    private gameStateUpdateIntervals: Map<string, NodeJS.Timeout> = new Map();

    constructor(private readonly gameService: GameService) {}

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('GameGateway');

    /**
     * Handles new client connection.
     * @param client - The socket client that connected.
     */
    async handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    /**
     * Handles client disconnection. Removes the client from the room they are part of,
     * and updates the remaining clients in the room.
     * @param client - The socket client that disconnected.
     */
    async handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    
        const roomId = this.findRoomIdByClientId(client.id);
    
        if (roomId) {
          client.leave(roomId);
          this.logger.log(`Client ${client.id} removed from room ${roomId}`);
          this.server.to(roomId).emit('user-disconnected', { clientId: client.id, roomId });
        }
        this.onlinePlayers.delete(client.id);
        this.clientRooms.delete(client.id);
    }

    /**
     * Finds the room ID associated with a given client ID.
     * @param clientId - The ID of the client.
     * @returns The room ID if found, otherwise undefined.
     */
    private findRoomIdByClientId(clientId: string): string | undefined {
        return this.clientRooms.get(clientId);
    }

    /**
     * Handles the 'quit-match' message to manage a player's request to quit a match.
     * It sets the player as having forfeited and updates the game state accordingly.
     * @param client - The socket client sending the quit request.
     * @param playerId - The ID of the player quitting the match.
     */
    @SubscribeMessage('quit-match')
    quitMatch(client: Socket, playerId: number | string): void {
        console.log("TEST:", playerId);

        const roomId = this.findRoomIdByClientId(client.id);
        if (roomId) {
            console.log("Room ID found:", roomId);
            const gameState = this.gameStates.get(roomId)?.getGameState();
            if (gameState) {
                console.log("GameState found");
                const playerInfo = this.onlinePlayers.get(client.id);

                console.log("PlayerINFO:", playerInfo);
                if (playerInfo && playerInfo.playerId === playerId) {
                    gameState.setForfeit(playerId);
                    client.emit('confirm-quit-match', { status: 'Successfully left the match.' });
                } else {
                    client.emit('error-quit-match', { status: 'Player information mismatch or not found.' });
                }
            } else {
                client.emit('error-quit-match', { status: 'Error gameState not found.' });
            }
        } else {
            client.emit('error-quit-match', { status: 'Error leaving room or room not found.' });
        }
    }
    
    /**
     * Handles the 'rejoin-room' message to allow a client to rejoin a game room.
     * @param client - The socket client sending the rejoin request.
     * @param data - Data containing the room ID and username for the rejoining client.
     */
    @SubscribeMessage('rejoin-room')
    rejoinRoom(client: Socket, data: { playerId: string | number, roomId: string, username: string}): void {
        const playerId = data.playerId;
        const roomId = data.roomId;
        const username = data.username;
        const room = this.server.sockets.adapter.rooms.get(roomId);
        
        if (room) {
            client.join(roomId);
            client.emit('rejoined-room', { status: 'Rejoined the room', roomId });
    
            this.clientRooms.set(client.id, roomId);
            console.log("playerID rejoinRoom:", playerId);
            this.onlinePlayers.set(client.id, { playerId: playerId, username: username });
        } else {
            client.emit('rejoin-failed', { status: 'Failed to rejoin the room', roomId });
        }
    }

    /**
     * Handles the 'ask-games-informations' message to send the current game state to the client.
     * @param client - The socket client requesting the game information.
     * @param roomId - The ID of the room for which game information is requested.
     */
    @SubscribeMessage('ask-games-informations')
    updateGame(client: Socket, roomId: string): void {
        const gameState = this.gameStates.get(roomId).getGameState();

        if (gameState) {
            this.sendGameState(roomId, gameState);
        } else {
            client.emit('cant-found-games-informations', { message: 'Game\'s information not available for provided room ID.' });
        }
    }

    /**
     * Handles the 'update-racket' message to update the position of a player's racket.
     * @param client - The socket client sending the update request.
     * @param roomId - The ID of the room in which the game is taking place.
     * @param action - The action specifying which racket to move and in which direction.
     */
    @SubscribeMessage('update-racket')
    updateRacket(client: Socket, [roomId, action]: [string, string]): void {
        const gameState = this.gameStates.get(roomId).getGameState();

        if (gameState) {
            switch (action) {
                case 'racket1-up':
                    gameState.moveRacket(Player.Player1, Direction.Up);
                    break;
                case 'racket1-down':
                    gameState.moveRacket(Player.Player1, Direction.Down);
                    break;
                case 'racket2-up':
                    gameState.moveRacket(Player.Player2, Direction.Up);
                    break;
                case 'racket2-down':
                    gameState.moveRacket(Player.Player2, Direction.Down);
                    break;
                default:
                    client.emit('cant-update-racket', { message: 'Can\'t update racket' });
                    break;
            }
        } else {
            client.emit('cant-update-racket', { message: 'Can\'t update racket' });
        }
    }

    /**
     * Starts a countdown in a game room, emitting a countdown event every second.
     * @param roomId - The ID of the room where the countdown is taking place.
     * @param duration - The duration of the countdown in seconds.
     * @param gameLoop - The game loop service associated with the room.
     */
    private startCountDown(roomId: string, duration: number, gameLoop): void {
        let remaining = duration;
        const tick = () => {
            this.server.to(roomId).emit('timer-before-launch', remaining);
            if (remaining === -1) {
                gameLoop.startGameLoop();
            } else {
                remaining--;
                setTimeout(tick, 1000);
            }
        };
        tick();
    }    

    /**
     * Handles the 'set-ready' message to set a player's readiness in a game room
     * @param client - The socket client sending the readiness update.
     * @param roomId - The ID of the room where the player's readiness is being updated.
     * @param action - The action specifying which player is being updated.
     */
    @SubscribeMessage('set-ready')
    setReady(client: Socket, [roomId, action]: [string, string]): void {
        const gameLoop = this.gameStates.get(roomId);
        const gameState = gameLoop.getGameState();

        if (gameState) {
            const player = action === 'player1' ? 'first' : 'second';
            gameState.setReady(!gameState.playerReady[player], action);

            if (gameState.playerReady.first && gameState.playerReady.second) {
                this.startCountDown(roomId, 3, gameLoop);
            }            
        } else {
            client.emit('error-set-ready', { message: 'Can\'t set player to ready' });
        }
    }

    /**
     * Handles the 'set-want-base-game' message to toggle the base game option for a player.
     * @param client - The socket client sending the request.
     * @param roomId - The ID of the room where the game state is managed.
     * @param action - The action indicating which player (player1 or player2) and their choice.
     */
    @SubscribeMessage('set-want-base-game')
    setWantBaseGame(client: Socket, [roomId, action]: [string, string]): void {
        const gameLoop = this.gameStates.get(roomId);
        const gameState = gameLoop.getGameState();

        if (gameState) {
            switch (action) {
                case 'player1':
                    if (gameState.wantBaseGame.first) {
                        gameState.setWantBaseGame(false, 'player1');
                    } else {
                        gameState.setWantBaseGame(true, 'player1');
                    }
                    break;
                case 'player2':
                    if (gameState.wantBaseGame.second) {
                        gameState.setWantBaseGame(false, 'player2');
                    } else {
                        gameState.setWantBaseGame(true, 'player2');
                    }
                    break;
                default:
                    client.emit('error-set-want-base-game', { message: 'Can\'t set want base game' });
                    break;
            }
        } else {
            client.emit('error-set-want-base-game', { message: 'Can\'t set want base game' });
        }
    }

    /**
     * Handles the 'set-small-racket' message to toggle the small racket option for a player.
     * @param client - The socket client sending the request.
     * @param roomId - The ID of the room where the game state is managed.
     * @param action - The action indicating which player (player1 or player2) and their choice.
     */
    @SubscribeMessage('set-small-racket')
    setSmallRacket(client: Socket, [roomId, action]: [string, string]): void {
        const gameLoop = this.gameStates.get(roomId);
        const gameState = gameLoop.getGameState();

        if (gameState) {
            switch (action) {
                case 'player1':
                    if (gameState.smallRacket.first) {
                        gameState.setSmallRacket(false, 'player1');
                    } else {
                        gameState.setSmallRacket(true, 'player1');
                    }
                    break;
                case 'player2':
                    if (gameState.smallRacket.second) {
                        gameState.setSmallRacket(false, 'player2');
                    } else {
                        gameState.setSmallRacket(true, 'player2');
                    }
                    break;
                default:
                    client.emit('error-set-small-racket', { message: 'Can\'t set small racket' });
                    break;
            }
        } else {
            client.emit('error-set-small-racket', { message: 'Can\'t set small racket' });
        }
    }

    /**
     * Handles the 'set-obstacle' message to toggle the obstacle option for a player.
     * @param client - The socket client sending the request.
     * @param roomId - The ID of the room where the game state is managed.
     * @param action - The action indicating which player (player1 or player2) and their choice.
     */
    @SubscribeMessage('set-obstacle')
    setObstacle(client: Socket, [roomId, action]: [string, string]): void {
        const gameLoop = this.gameStates.get(roomId);
        const gameState = gameLoop.getGameState();

        if (gameState) {
            switch (action) {
                case 'player1':
                    if (gameState.obstacle.first) {
                        gameState.setObstacle(false, 'player1');
                    } else {
                        gameState.setObstacle(true, 'player1');
                    }
                    break;
                case 'player2':
                    if (gameState.obstacle.second) {
                        gameState.setObstacle(false, 'player2');
                    } else {
                        gameState.setObstacle(true, 'player2');
                    }
                    break;
                default:
                    client.emit('error-set-obstacle', { message: 'Can\'t set obstacle' });
                    break;
            }
        } else {
            client.emit('error-set-obstacle', { message: 'Can\'t set small obstacle' });
        }
    }

    /**
     * Adds a player to the online players map.
     * @param playerId - The ID of the player.
     * @param playerInfo - The player's information including socket ID and username.
     */
    public addOnlinePlayer(socketId: string, playerInfo: { playerId: number | string; username: string }) {
        console.log("Add Online Player:", playerInfo.playerId);
        this.onlinePlayers.set(socketId, playerInfo);
    }

    /**
     * Creates a new match and initializes the game state. It also sets up the players in the match and starts the game loop.
     * @param match - The match object containing information about the two players.
     * @param isRanked - Boolean indicating if the match is a ranked match.
 */
    public createMatch(match: { player1: PlayerInQueue, player2: PlayerInQueue }, isRanked: boolean): void {
        const roomId = uuidv4();
        const player1Info = this.findPlayerInfoById(match.player1.id);
        const player2Info = this.findPlayerInfoById(match.player2.id);

        console.log("Player1Info:", player1Info);
        console.log("Player2Info:", player2Info);

        if (!player1Info || !player2Info) {
            this.logger.error(`Player information missing for match creation. Player1: ${match.player1.id}, Player2: ${match.player2.id}`);
            return;
        }
        const newGameState = new GameStateService();
        newGameState.initialize(
            match.player1.id,
            match.player2.id,
            player1Info.username,
            player2Info.username,
            (result) => {
                this.logger.log(`${result.winner} has won the match for reason: ${result.reason}!`);
                this.endMatch(roomId, isRanked, result);
            }
        );

        console.log("GameState initialized");
        
        this.server.sockets.sockets.get(player1Info.socketId)?.join(roomId);
        this.server.sockets.sockets.get(player2Info.socketId)?.join(roomId);
        this.clientRooms.set(player1Info.socketId, roomId);
        this.clientRooms.set(player2Info.socketId, roomId);

        if (isRanked) {
            this.server.to(roomId).emit('match-found-ranked', { 
                player1: { id: match.player1.id, username: player1Info.username }, 
                player2: { id: match.player2.id, username: player2Info.username }, 
                roomId 
            });
        } else {
            console.log("Match standard");
            this.server.to(roomId).emit('match-found-standard', { 
                player1: { id: match.player1.id, username: player1Info.username }, 
                player2: { id: match.player2.id, username: player2Info.username }, 
                roomId 
            });
        }
        const newGameLoop = new GameLoopService(newGameState);
        this.gameStates.set(roomId, newGameLoop);
        
        const gameStateUpdateInterval = setInterval(() => {
            const gameState = this.gameStates.get(roomId)?.getGameState();
            if (gameState) {
                this.sendGameState(roomId, gameState);
            }
        }, 1000 / 120);
        this.gameStateUpdateIntervals.set(roomId, gameStateUpdateInterval);
    }

    private findPlayerInfoById(playerId: number | string): { socketId: string; username: string } | undefined {
        let playerInfo;
    
        this.onlinePlayers.forEach((info, socketId) => {
            if (info.playerId === playerId) {
                playerInfo = { socketId, ...info };
            }
        });
    
        return playerInfo;
    }    

    /**
     * Sends the current game state to all clients in a specified room.
     * @param roomId - The ID of the room where the game is taking place.
     * @param gameState - The current state of the game to be sent.
     */
    private sendGameState(roomId: string, gameState: GameState): void {
        const informations = {
            player1ID: gameState.player1ID,
            player2ID: gameState.player2ID,
            player1Username: gameState.player1Username,
            player2Username: gameState.player2Username,
            score1: gameState.score1,
            score2: gameState.score2,
            racket1Size: gameState.racket1Size,
            racket2Size: gameState.racket2Size,
            racket1Position: gameState.racket1Position,
            racket2Position: gameState.racket2Position,
            ballSize: gameState.ballSize,
            ballPosition: gameState.ballPosition,
            playerReady: gameState.playerReady,
            wantBaseGame: gameState.wantBaseGame,
            smallRacket: gameState.smallRacket,
            obstacle: gameState.obstacle,
            obstacle1Size: gameState.obstacle1Size,
            obstacle2Size: gameState.obstacle2Size,
            obstacle1Position: gameState.obstacle1Position,
            obstacle2Position: gameState.obstacle2Position,
        };
        this.server.to(roomId).emit('games-informations', informations);
    }

    /**
     * Handles the end of a match. It emits the match result to clients, updates the game state, and cleans up.
     * @param roomId - The ID of the room where the match took place.
     * @param wasRanked - Indicates whether the match was a ranked match.
     * @param matchResult - The result of the match, including the winner and the reason.
     */
    private endMatch(roomId: string, wasRanked: boolean, matchResult: EndMatchResult): void {
        const gameState = this.gameStates.get(roomId).getGameState();
    
        if (gameState) {
            this.server.to(roomId).emit('match-ended', matchResult);
            const room = this.server.sockets.adapter.rooms.get(roomId);
            if (room) {
                this.gameStates.get(roomId).stopGameLoop();
                if (wasRanked) {
                    let id1: number = parseInt(gameState.player1ID as string, 10);
                    let id2: number = parseInt(gameState.player2ID as string, 10);;

                    const createGameDto = new CreateGameDTO();
    
                    createGameDto.idPlayerOne = id1;
                    createGameDto.idPlayerSecond = id2;
                    if (gameState.score1 > gameState.score2)
                        createGameDto.idWinner = id1;
                    else
                        createGameDto.idWinner = id2;
                    createGameDto.scoreLeft = gameState.score1;
                    createGameDto.scoreRight = gameState.score2;
                    this.gameService.createGame(createGameDto);
                }
                for (const clientId of room) {
                    const clientSocket = this.server.sockets.sockets.get(clientId);
                    if (clientSocket) {
                        this.updateGame(clientSocket, roomId);
                        clientSocket.leave(roomId);
                        this.clientRooms.delete(clientId);
                        this.onlinePlayers.delete(clientId);
                    }
                }
            }
            setTimeout(() => {
                const gameStateUpdateInterval = this.gameStateUpdateIntervals.get(roomId);
                if (gameStateUpdateInterval) {
                    clearInterval(gameStateUpdateInterval);
                    this.gameStateUpdateIntervals.delete(roomId);
                }
                this.gameStates.delete(roomId);
            },  15000);
        }
    }
}