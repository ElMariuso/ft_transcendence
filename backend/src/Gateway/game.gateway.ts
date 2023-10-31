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

@WebSocketGateway({ 
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
    }
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private onlinePlayers: Map<number | string, { socketId: string; username: string }> = new Map();
    private clientRooms: Map<string, string> = new Map();
    private gameStates: Map<string, GameLoopService> = new Map();
    private gameStateUpdateIntervals: Map<string, NodeJS.Timeout> = new Map();

    constructor(
        private readonly gameService: GameService,
    ) {

    }

    @WebSocketServer() server: Server;
    private logger: Logger = new Logger('GameGateway');

    async handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

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
      
    @SubscribeMessage('quit-match')
    quitMatch(client: Socket, playerId: number | string): void {
        const roomId = this.findRoomIdByClientId(client.id);
        if (roomId) {
            const gameState = this.gameStates.get(roomId).getGameState();
            if (gameState) {
                const playerLeaving = Array.from(this.onlinePlayers.entries()).find(([, value]) => value.socketId === client.id);
    
                if (playerLeaving) {
                    const [playerId] = playerLeaving;
                    gameState.setForfeit(playerId);
                } else {
                    client.emit('error-quit-match', { status: 'Player not found.' });
                }
            } else {
                client.emit('error-quit-match', { status: 'Error gameState not found' });
            }
        } else {
            client.emit('error-quit-match', { status: 'Error leaving room or room not found' });
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

    @SubscribeMessage('ask-games-informations')
    updateGame(client: Socket, roomId: string): void {
        const gameState = this.gameStates.get(roomId).getGameState();

        if (gameState) {
            this.sendGameState(roomId, gameState);
        } else {
            client.emit('cant-found-games-informations', { message: 'Game\'s information not available for provided room ID.' });
        }
    }

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

    @SubscribeMessage('set-ready')
    setReady(client: Socket, [roomId, action]: [string, string]): void {
        const gameLoop = this.gameStates.get(roomId);
        const gameState = gameLoop.getGameState();

        if (gameState) {
            switch (action) {
                case 'player1':
                    if (gameState.playerReady.first) {
                        gameState.setReady(false, 'player1');
                    } else {
                        gameState.setReady(true, 'player1');
                    }
                    break;
                case 'player2':
                    if (gameState.playerReady.second) {
                        gameState.setReady(false, 'player2');
                    } else {
                        gameState.setReady(true, 'player2');
                    }
                    break;
                default:
                    client.emit('error-set-ready', { message: 'Can\'t set player to ready' });
                    break;
            }
            if (gameState.playerReady.first && gameState.playerReady.second) {
                setTimeout(() => {
                    gameLoop.startGameLoop();
                }, 3000);
            }
        } else {
            client.emit('error-set-ready', { message: 'Can\'t set player to ready' });
        }
    }

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

    public addOnlinePlayer(playerId: number | string, playerInfo: { socketId: string; username: string }) {
        this.onlinePlayers.set(playerId, playerInfo);
    }

    public createMatch(match: { player1: PlayerInQueue, player2: PlayerInQueue }, isRanked: boolean): void {
        const player1Info = this.onlinePlayers.get(match.player1.id);
        const player2Info = this.onlinePlayers.get(match.player2.id);
        const roomId = uuidv4();

        if (player1Info && player2Info) {
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

            this.server.sockets.sockets.get(player1Info.socketId)?.join(roomId);
            this.server.sockets.sockets.get(player2Info.socketId)?.join(roomId);

            this.clientRooms.set(player1Info.socketId, roomId);
            this.clientRooms.set(player2Info.socketId, roomId);

            this.server.to(roomId).emit('match-found-standard', { 
                player1: { id: match.player1.id, username: player1Info.username }, 
                player2: { id: match.player2.id, username: player2Info.username }, 
                roomId 
            });

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
    }

    private findRoomIdByClientId(clientId: string): string | undefined {
        return this.clientRooms.get(clientId);
    }

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
            smallRacket: gameState.smallRacket,
            obstacle: gameState.obstacle,
            obstacle1Size: gameState.obstacle1Size,
            obstacle2Size: gameState.obstacle2Size,
            obstacle1Position: gameState.obstacle1Position,
            obstacle2Position: gameState.obstacle2Position,
        };
        this.server.to(roomId).emit('games-informations', informations);
    }

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