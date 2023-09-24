import { Module } from '@nestjs/common';
import { AuthModule } from './Module/auth.module'
import { UserModule } from './Module/user.module';

import { AppController } from './app.controller';
import { AuthController } from './Controller/auth.controller';

import { AppService } from './app.service';

@Module({
  imports: [AuthModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
