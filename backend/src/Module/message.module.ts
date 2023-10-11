import { Module } from '@nestjs/common';
import { MessageController } from 'src/Controller/message.controller';
import { MessageService } from 'src/Service/message.service';
import { MessageQuery } from 'src/Query/message.query';
import { MessageDTO } from 'src/DTO/message/message.dto';
import { CreateMessageDTO} from 'src/DTO/message/createMessage.dto';

import { UserQuery } from 'src/Query/user.query';
import { ChannelQuery } from 'src/Query/channel.query';
import { UserChannelQuery } from 'src/Query/userchannel.query';

import { PrismaClient } from '@prisma/client';

import { AchievementService } from 'src/Service/achievement.service';
import { AchievementQuery } from "src/Query/achievement.query";
import { FriendQuery } from "src/Query/friend.query";
import { GameQuery } from "src/Query/game.query";


@Module({
  controllers: [MessageController],
  providers: [
	MessageDTO,
	CreateMessageDTO,
	PrismaClient,
	MessageQuery,
	UserQuery,
	ChannelQuery,
	UserChannelQuery,
	MessageService,
	AchievementService,
	AchievementQuery,
	FriendQuery,
	GameQuery,
],
})
export class MessageModule {}