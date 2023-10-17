import { Module } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

import { AchievementController } from "src/Controller/achievement.controller";

import { AchievementService } from "src/Service/achievement.service";

import { AchievementQuery } from "src/Query/achievement.query";
import { FriendQuery } from "src/Query/friend.query";
import { GameQuery } from "src/Query/game.query";
import { MessageQuery } from "src/Query/message.query";
import { UserQuery } from "src/Query/user.query";

@Module({
	controllers: [AchievementController],
	providers: [
	  PrismaClient,
	  AchievementService,
	  FriendQuery,
	  GameQuery,
	  AchievementQuery,
	  UserQuery,
	  MessageQuery,
  ],
  })
  export class AchievementModule {}