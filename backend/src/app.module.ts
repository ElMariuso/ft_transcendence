import { Module } from '@nestjs/common';
import { AuthModule } from './Module/auth.module'
import { UserModule } from './Module/user.module';

import { AuthController } from './Controller/auth.controller';
import { UserController } from './Controller/user.controller';

import { AuthService } from './Service/auth.service';
import { UserService } from './Service/user.service';

import { UserQuery } from 'src/Query/user.query';
import { PrismaClient, User } from '@prisma/client';
import { CreateUserDTO } from 'src/DTO/user/createUser.dto';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [AuthController, UserController],
  providers: [UserService, AuthService, UserQuery, PrismaClient, CreateUserDTO ],
})
export class AppModule {}
