import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

/**
 * Enumerates the possible statuses for players.
 */
enum PlayerStatus {
    Online = 0,
    Offline = 1,
    InGame = 2
}

/**
 * WebSocket gateway for managing real-time player statuses.
 * Allows for tracking and updating player statuses and responding to player status requests.
 */
@WebSocketGateway({ 
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
    }
})
export class StatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private logger: Logger = new Logger('StatusGateway');
    private listOfPlayers: Map<number, PlayerStatus> = new Map();

    /**
     * Initializes the WebSocket server.
     */
    @WebSocketServer() server: Server;

    /**
     * Handles the event when a client connects to the WebSocket server.
     * Logs the connection event.
     * 
     * @param client - The connecting Socket instance.
     */
    async handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    /**
     * Handles the event when a client disconnects from the WebSocket server.
     * Logs the disconnection event.
     * 
     * @param client - The disconnecting Socket instance.
     */
    async handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);;
    }

    /**
     * Listens for 'update-status' messages from clients to update a player's status.
     * Updates the player's status in the listOfPlayers map.
     * 
     * @param client - The client's Socket instance.
     * @param payload - The incoming data containing playerId and status.
     */
    @SubscribeMessage('update-status')
    handleStatusUpdate(client: Socket, payload: { playerId: number, status: PlayerStatus }) {
        const { playerId, status } = payload;
        this.listOfPlayers.set(playerId, status);
        this.logger.log(`Status updated for player ${playerId}: ${PlayerStatus[status]}`);
    }

    /**
     * Listens for 'get-status' messages from clients to retrieve status information for multiple players.
     * Emits the 'status-response' event to the requesting client with status information.
     * 
     * @param client - The client's Socket instance requesting the status information.
     * @param playerIds - Array of player IDs whose statuses are being requested.
     */
    @SubscribeMessage('get-status')
    async getStatus(client: Socket, playerIds: number[]): Promise<void> {
        const statusRet = playerIds.map(playerId => ({
            playerId,
            status: this.listOfPlayers.get(playerId) || PlayerStatus.Offline
        }));
        client.emit('status-response', statusRet);
    }
}