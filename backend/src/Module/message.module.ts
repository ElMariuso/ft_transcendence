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
],
})
export class MessageModule {}