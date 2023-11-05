import { Module } from '@nestjs/common';
import { GameController } from 'src/Controller/game.controller';
import { GameService } from 'src/Service/game.service';
import { GameQuery } from 'src/Query/game.query';
import { UserQuery } from 'src/Query/user.query';
import { GameDTO } from 'src/DTO/game/game.dto';
import { CreateGameDTO } from 'src/DTO/game/createGame.dto';
import { PrismaClient } from '@prisma/client';
import { UpdateGameDTO } from 'src/DTO/game/updateGame.dto';
import { AchievementService } from 'src/Service/achievement.service';
import { AchievementQuery } from "src/Query/achievement.query";
import { FriendQuery } from "src/Query/friend.query";
import { MessageQuery } from "src/Query/message.query";
import { GameGateway } from 'src/Gateway/game.gateway';
import { GameLoopService } from 'src/Service/gameloop.service';
import { GameStateService } from 'src/Service/gamestate.service';


@Module({
	controllers: [GameController],
	providers: [
		GameDTO,
		CreateGameDTO,
		PrismaClient,
		GameQuery,
		UserQuery,
		GameService,
		AchievementService,
		AchievementQuery,
		FriendQuery,
		MessageQuery,
		UpdateGameDTO,
		GameGateway,
		GameLoopService,
		GameStateService
	],
	exports: [GameService, UserQuery, AchievementService, AchievementQuery, FriendQuery, MessageQuery, GameQuery, GameDTO, GameGateway],
})
export class GameModule {}