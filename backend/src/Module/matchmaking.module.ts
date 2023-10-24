import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MatchmakingGateway } from 'src/Gateway/matchmaking.gateway';
import { MatchmakingService } from 'src/Service/matchmaking.service';
import { QueueService } from 'src/Service/queue.service';
import { GameModule } from './game.module';

@Module({
    imports: [
            EventEmitterModule.forRoot(),
            GameModule
    ],
    providers: [
        MatchmakingGateway,
        MatchmakingService,
        QueueService
    ],
})

export class MatchmakingModule {}