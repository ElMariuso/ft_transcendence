import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MatchmakingService } from 'src/Service/matchmaking.service';
import { MatchmakingController } from 'src/Controller/matchmaking.controller';
import { GameQuery } from 'src/Query/game.query';
import { QueueService } from 'src/Service/queue.service';
import { CreateGameDTO } from 'src/DTO/game/createGame.dto';
import { UpdateGameDTO } from 'src/DTO/game/updateGame.dto';

@Module({
    providers: [PrismaClient, MatchmakingService, GameQuery, QueueService, CreateGameDTO, UpdateGameDTO],
    controllers: [MatchmakingController],
    exports: [MatchmakingService, QueueService, GameQuery],
})
export class GameModule {}