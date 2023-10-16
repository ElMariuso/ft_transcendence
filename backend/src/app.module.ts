import { Module } from '@nestjs/common';
import { AuthModule } from './Module/auth.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/Module/user.module';
import { GameModule } from 'src/Module/game.module';
import { ChannelModule } from 'src/Module/channel.module';
import { MessageModule } from 'src/Module/message.module';
import { UserChannelModule } from 'src/Module/userchannel.module';
import { MatchmakingModule } from './Module/matchmaking.module';

import { PrismaClient, User } from '@prisma/client';


@Module({
  imports: [
    UserModule,
    GameModule,
    ChannelModule,
    MessageModule,
    UserChannelModule,
    AuthModule,
    MatchmakingModule
  ],
  controllers: [
    AppController
  ],
  providers: [AppService, PrismaClient],
})
export class AppModule {}