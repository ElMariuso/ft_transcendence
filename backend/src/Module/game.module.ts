import { Module } from '@nestjs/common';
import { GameController } from 'src/Controller/game.controller';
import { GameService } from 'src/Service/game.service';
import { GameQuery } from 'src/Query/game.query';
import { GameDTO } from 'src/DTO/game/game.dto';
import { CreateGameDTO} from 'src/DTO/game/createGame.dto';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [GameController],
  providers: [
	GameDTO,
	CreateGameDTO,
	PrismaClient,
	GameQuery,
	GameService,
],
})
export class GameModule {}