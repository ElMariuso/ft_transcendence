import { Module } from '@nestjs/common';
import { AuthService } from '../Service/auth.service';
import { AuthController } from '../Controller/auth.controller';
import { FT_Strategy } from '../Strategy/42.strategy';
import { UserModule } from './user.module';
import { PrismaClient, User } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../Utils/jwtConstants'


@Module({
  imports: [UserModule, JwtModule.register({global: true, secret: jwtConstants.secret,})],
  providers: [FT_Strategy, AuthService, PrismaClient],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}