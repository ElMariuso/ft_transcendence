import { Module } from '@nestjs/common';
import { UserController } from 'src/Controller/user.controller';
import { UserService } from 'src/Service/user.service';
import { UserQuery } from 'src/Query/user.query';
import { UserDTO } from 'src/DTO/user/user.dto';
import { CreateUserDTO} from 'src/DTO/user/createUser.dto';
import { UpdateUserDTO } from 'src/DTO/user/updateUser.dto';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [UserController],
  providers: [
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