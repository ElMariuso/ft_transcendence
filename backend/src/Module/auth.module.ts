import { Module } from '@nestjs/common';
import { AuthService } from '../Service/auth.service';
import { UserService } from '../Service/user.service';
import { UserQuery } from '../Query/user.query';
import { AuthController } from '../Controller/auth.controller';
import { FT_Strategy } from '../Strategy/42.strategy';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './jwt.strategy';
import { UserModule } from './user.module';
import { PrismaClient, User } from '@prisma/client';
import { CreateUserDTO } from 'src/DTO/user/createUser.dto';


@Module({
  imports: [UserModule], //JwtModule.register({})
  providers: [FT_Strategy, AuthService, UserService, UserQuery, PrismaClient, CreateUserDTO], //, AuthService, PrismaService, JwtStrategy
  controllers: [AuthController],
})
export class AuthModule {}