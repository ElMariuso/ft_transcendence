import { Module } from '@nestjs/common';
import { ChannelController } from 'src/Controller/channel.controller';
import { ChannelService } from 'src/Service/channel.service';
import { ChannelQuery } from 'src/Query/channel.query';
import { ChannelDTO } from 'src/DTO/channel/channel.dto';
import { CreateChannelDTO} from 'src/DTO/channel/createChannel.dto';
import { UserInChannelDTO } from 'src/DTO/user/userInChannel.dto';

import { ChannelTypeQuery } from 'src/Query/type.query';
import { UserQuery } from 'src/Query/user.query';
import { MessageQuery } from 'src/Query/message.query';
import { UserChannelQuery } from 'src/Query/userchannel.query';

import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [ChannelController],
  providers: [
	ChannelDTO,
	CreateChannelDTO,
	UserInChannelDTO,
	PrismaClient,
	ChannelQuery,
	ChannelService,
	ChannelTypeQuery,
	UserQuery,
	MessageQuery,
	UserChannelQuery,
],
})
export class ChannelModule {}