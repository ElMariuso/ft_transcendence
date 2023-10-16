import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MatchmakingController } from 'src/Controller/matchmaking.controller';
import { MatchmakingService } from 'src/Service/matchmaking.service';
import { QueueService } from 'src/Service/queue.service';
import { GameQuery } from 'src/Query/game.query';
import { CreateGameDTO } from 'src/DTO/game/createGame.dto';

@Module({
    controllers: [MatchmakingController],
    providers: [
        MatchmakingService,
        QueueService,
        GameQuery,
        CreateGameDTO,
        PrismaClient
    ],
})

export class MatchmakingModule {}