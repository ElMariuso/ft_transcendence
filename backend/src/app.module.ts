import { Module } from '@nestjs/common';
import { WebSocketModule } from '@nestjs/websockets';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'src/Module/user.module';
import { GameModule } from './Module/game.module';
import { AuthController } from './Controller/auth.controller';
// import { GameController } from './game/game.controller';
// import { GameService } from './game/game.service';

@Module({
  imports: [
    WebSocketModule.forRoot({
      namespace: 'matchmaking',
      serveClient: true,
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
