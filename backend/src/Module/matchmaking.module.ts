import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaClient } from '@prisma/client';
import { MatchmakingGateway } from 'src/Gateway/matchmaking.gateway';
import { MatchmakingService } from 'src/Service/matchmaking.service';
import { QueueService } from 'src/Service/queue.service';
import { GameQuery } from 'src/Query/game.query';
import { CreateGameDTO } from 'src/DTO/game/createGame.dto';
import { GameService } from 'src/Service/game.service';

@Module({
    imports: [EventEmitterModule.forRoot()],
    providers: [
        PrismaClient,
        MatchmakingGateway,
        MatchmakingService,
        GameService,
        QueueService,
        GameQuery,
        CreateGameDTO
    ],
})

export class MatchmakingModule {}