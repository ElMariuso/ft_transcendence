import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MatchmakingGateway } from 'src/Gateway/matchmaking.gateway';
import { MatchmakingService } from 'src/Service/matchmaking.service';
import { QueueService } from 'src/Service/queue.service';
import { GameQuery } from 'src/Query/game.query';
import { CreateGameDTO } from 'src/DTO/game/createGame.dto';

@Module({
    providers: [
        MatchmakingService,
        MatchmakingGateway,
        QueueService,
        GameQuery,
        CreateGameDTO,
        PrismaClient
    ],
})

export class MatchmakingModule {}