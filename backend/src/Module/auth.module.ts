import { Module } from '@nestjs/common';
import { AuthService } from '../Service/auth.service';
import { AuthController } from '../Controller/auth.controller';
import { FT_Strategy } from '../Strategy/42.strategy';
import { PrismaClient, User } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';

import { UserService } from 'src/Service/user.service';
import { UserQuery } from 'src/Query/user.query';
import { UserDTO } from 'src/DTO/user/user.dto';
import { CreateUserDTO} from 'src/DTO/user/createUser.dto';
import { UpdateUserDTO } from 'src/DTO/user/updateUser.dto';

import { FriendService } from 'src/Service/friend.service';
import { FriendQuery } from 'src/Query/friend.query';

import { AchievementService } from 'src/Service/achievement.service';
import { AchievementQuery } from "src/Query/achievement.query";
import { GameQuery } from "src/Query/game.query";
import { MessageQuery } from "src/Query/message.query";

import { BlockedService } from 'src/Service/blocked.service';
import { BlockedQuery } from 'src/Query/blocked.query';

import { FriendBlockedDTO } from 'src/DTO/user/friendblocked.dto';

@Module({
<<<<<<< HEAD
  imports: [JwtModule.register({ secret: process.env.jwtSecret,})],
  providers: [FT_Strategy, AuthService, PrismaClient,
	FriendBlockedDTO,
	BlockedQuery,
	BlockedService,
	FriendQuery,
	FriendService,
	UserDTO,
	CreateUserDTO,
	UpdateUserDTO,
	UserQuery,
	UserService,],
  controllers: [AuthController],
=======
	imports: [JwtModule.register({ secret: process.env.jwtSecret,})],
  	providers: [
		FT_Strategy,
		AchievementService,
		AchievementQuery,
		GameQuery,
		MessageQuery,
		AuthService,
		PrismaClient,
		FriendBlockedDTO,
		BlockedQuery,
		BlockedService,
		FriendQuery,
		FriendService,
		UserDTO,
		CreateUserDTO,
		UpdateUserDTO,
		UserQuery,
		UserService,
	],
  	controllers: [AuthController],
>>>>>>> master
})
export class AuthModule {}