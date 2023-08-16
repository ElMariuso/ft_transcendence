import { Injectable } from '@nestjs/common';
import { UserQuery } from '../Query/user.query';
import { User } from '@prisma/client';

@Injectable()
export class UserService
{
  constructor(private readonly userQuery: UserQuery) {}

  async findUserById(id: number): Promise<User | null>
  {
    return this.userQuery.findUserBydId(id);
  }
}
