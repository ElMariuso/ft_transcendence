import { Module } from '@nestjs/common';
import { AuthModule } from './Module/auth.module'
import { UserModule } from './Module/user.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { GameModule } from 'src/Module/game.module';
import { ChannelModule } from 'src/Module/channel.module';
import { MessageModule } from 'src/Module/message.module';
import { UserChannelModule } from 'src/Module/userchannel.module';
import { WebSocketsModule } from './Module/websockets.module';

import { AuthController } from './Controller/auth.controller';
import { UserController } from './Controller/user.controller';

import { PrismaClient, User } from '@prisma/client';


@Module({
  imports: [
    UserModule,
    GameModule,
    ChannelModule,
    MessageModule,
    UserChannelModule,
    WebSocketsModule,
    AuthModule
  ],
  controllers: [
    AppController,
    AuthController,
    UserController
  ],
  providers: [AppService, PrismaClient],
})
export class AppModule {}