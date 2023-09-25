import { Module } from '@nestjs/common';

import { UserChannelController } from 'src/Controller/userchannel.controller';

import { UserChannelService } from 'src/Service/userchannel.service';

import { ChannelDTO } from 'src/DTO/channel/channel.dto';
import { UserChannelDTO } from 'src/DTO/userchannel/userchannel.dto';
import { CreateUserChannelDTO } from 'src/DTO/userchannel/createUserChannel.dto';
import { UpdateRoleUserChannelDTO } from 'src/DTO/userchannel/updateRoleUserChannel.dto';
import { UpdateMuteTimeUserChannelDTO } from 'src/DTO/userchannel/updateMuteTimeUserChannel.dto';

import { UserQuery } from 'src/Query/user.query';
import { ChannelQuery } from 'src/Query/channel.query';
import { UserChannelQuery } from 'src/Query/userchannel.query';
import { RoleQuery } from 'src/Query/role.query';

import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [UserChannelController],
  providers: [
	UserChannelDTO,
	ChannelDTO,
	CreateUserChannelDTO,
	UpdateRoleUserChannelDTO,
	UpdateMuteTimeUserChannelDTO,
	ChannelQuery,
	UserChannelQuery,
	RoleQuery,
	UserQuery,
	UserChannelService,
	PrismaClient,
],
})
export class UserChannelModule {}