import { Module } from '@nestjs/common';
import { AuthModule } from './Module/auth.module'
import { UserModule } from './Module/user.module';

import { AuthController } from './Controller/auth.controller';
import { UserController } from './Controller/user.controller';

import { PrismaClient, User } from '@prisma/client';


@Module({
  imports: [AuthModule, UserModule],
  controllers: [AuthController, UserController],
  providers: [PrismaClient],
})
export class AppModule {}
