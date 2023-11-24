import { Module } from '@nestjs/common';
import { ChannelController } from 'src/Controller/channel.controller';
import { ChannelService } from 'src/Service/channel.service';
import { ChannelQuery } from 'src/Query/channel.query';
import { ChannelDTO } from 'src/DTO/channel/channel.dto';
import { CreateChannelDTO} from 'src/DTO/channel/createChannel.dto';
import { UpdateChannelDTO } from 'src/DTO/channel/updateChannel.dto';
import { UserInChannelDTO } from 'src/DTO/user/userInChannel.dto';

import { ChannelTypeQuery } from 'src/Query/type.query';
import { UserQuery } from 'src/Query/user.query';
import { MessageQuery } from 'src/Query/message.query';
import { UserChannelQuery } from 'src/Query/userchannel.query';
import { RoleQuery } from 'src/Query/role.query';

import { PrismaClient } from '@prisma/client';
import { BlockedQuery } from 'src/Query/blocked.query';

@Module({
  controllers: [ChannelController],
  providers: [
    ChannelDTO,
    CreateChannelDTO,
    UpdateChannelDTO,
    UserInChannelDTO,
    PrismaClient,
    ChannelQuery,
    ChannelService,
    ChannelTypeQuery,
    UserQuery,
    MessageQuery,
    UserChannelQuery,
    RoleQuery,
	BlockedQuery
],
})
export class ChannelModule {}