import { Module } from '@nestjs/common';
import { AuthService } from '../Service/auth.service';
import { AuthController } from '../Controller/auth.controller';
import { FT_Strategy } from '../Strategy/42.strategy';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './jwt.strategy';

@Module({
//   imports: [JwtModule.register({})],
  providers: [FT_Strategy, AuthService], //, AuthService, PrismaService, JwtStrategy
  controllers: [AuthController],
})
export class AuthModule {}