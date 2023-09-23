import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from 'src/Module/user.module';
import { GameModule } from './Module/game.module';
import { WebSocketsModule } from './Module/websockets.module';

import { AuthController } from './Controller/auth.controller';

@Module({
  imports: [
    GameModule,
    WebSocketsModule
    // WebSocketsModule.forRoot({
      // namespace: 'matchmaking',
      // serveClient: true,
    // }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
