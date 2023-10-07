import { Module } from '@nestjs/common';
import { UserController } from 'src/Controller/user.controller';
import { UserService } from 'src/Service/user.service';
import { UserQuery } from 'src/Query/user.query';
import { UserDTO } from 'src/DTO/user/user.dto';
import { CreateUserDTO} from 'src/DTO/user/createUser.dto';
import { UpdateUserDTO } from 'src/DTO/user/updateUser.dto';

import { FriendService } from 'src/Service/friend.service';
import { FriendQuery } from 'src/Query/friend.query';

import { BlockedService } from 'src/Service/blocked.service';
import { BlockedQuery } from 'src/Query/blocked.query';

import { FriendBlockedDTO } from 'src/DTO/user/friendblocked.dto';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [UserController],
  providers: [
	FriendBlockedDTO,
	BlockedQuery,
	BlockedService,
	FriendQuery,
	FriendService,
	UserDTO,
	CreateUserDTO,
	UpdateUserDTO,
	PrismaClient,
	UserQuery,
	UserService,
],
exports: [UserService, UserQuery, CreateUserDTO]
})
export class UserModule {}