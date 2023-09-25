import { Module } from '@nestjs/common';
import { ChannelController } from 'src/Controller/channel.controller';
import { ChannelService } from 'src/Service/channel.service';
import { ChannelQuery } from 'src/Query/channel.query';
import { ChannelDTO } from 'src/DTO/channel/channel.dto';
import { CreateChannelDTO} from 'src/DTO/channel/createChannel.dto';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [ChannelController],
  providers: [
	ChannelDTO,
	CreateChannelDTO,
	PrismaClient,
	ChannelQuery,
	ChannelService,
],
})
export class ChannelModule {}