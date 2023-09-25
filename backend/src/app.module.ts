import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/Module/user.module';
import { GameModule } from 'src/Module/game.module';
import { ChannelModule } from 'src/Module/channel.module';
import { MessageModule } from 'src/Module/message.module';
import { AuthController } from './Controller/auth.controller';

@Module({
  imports: [
    UserModule,
    GameModule,
    ChannelModule,
    MessageModule,
  ],
  controllers: [
    AppController,
    AuthController,
  ],
  providers: [AppService],
})
export class AppModule {}