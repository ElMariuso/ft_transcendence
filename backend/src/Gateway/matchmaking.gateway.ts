import { SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { PlayerInQueue } from 'src/Model/player.model';
import { MatchmakingService } from 'src/Service/matchmaking.service';

@WebSocketGateway({ namespace: 'matchmaking' })
export class MatchmakingGateway {
    constructor(
        private readonly matchmakingService: MatchmakingService
    ) {}

    @SubscribeMessage('joinQueue')
    handleJoinQueue(client: any, data: any): WsResponse<any> {
        const player: PlayerInQueue = data.player;

        this.matchmakingService.add(player);
    
        const match = this.matchmakingService.match();
        
        if (match) {
            return { event: 'matchFound', data:match };
        } else {
            return { event: 'queued', data: 'queue' };
        }
    }
    
}
