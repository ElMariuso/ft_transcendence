import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaClient } from '@prisma/client';
import { MatchmakingGateway } from 'src/Gateway/matchmaking.gateway';
import { MatchmakingService } from 'src/Service/matchmaking.service';
import { QueueService } from 'src/Service/queue.service';
import { CreateGameDTO } from 'src/DTO/game/createGame.dto';
import { GameService } from 'src/Service/game.service';
import { UserQuery } from 'src/Query/user.query';
import { AchievementService } from 'src/Service/achievement.service';
import { AchievementQuery } from 'src/Query/achievement.query';
import { MessageQuery } from 'src/Query/message.query';
import { FriendQuery } from 'src/Query/friend.query';
import { GameQuery } from 'src/Query/game.query';
import { GameDTO } from 'src/DTO/game/game.dto';

@Module({
    imports: [EventEmitterModule.forRoot()],
    providers: [
        PrismaClient,
        MatchmakingGateway,
        MatchmakingService,
        QueueService,
        GameService,
        UserQuery,
        AchievementService,
        AchievementQuery,
        CreateGameDTO,
        MessageQuery,
        FriendQuery,
        GameQuery,
        GameDTO
    ],
})

export class MatchmakingModule {}