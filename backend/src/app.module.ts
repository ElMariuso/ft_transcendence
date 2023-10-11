import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/Module/user.module';
import { GameModule } from 'src/Module/game.module';
import { ChannelModule } from 'src/Module/channel.module';
import { MessageModule } from 'src/Module/message.module';
import { UserChannelModule } from 'src/Module/userchannel.module';
import { AuthController } from './Controller/auth.controller';
import { AchievementModule } from './Module/achievement.module';

@Module({
  imports: [
    UserModule,
    GameModule,
    ChannelModule,
    MessageModule,
    UserChannelModule,
    AchievementModule,
  ],
  controllers: [
    AppController,
    AuthController,
  ],
  providers: [AppService],
})
export class AppModule {}