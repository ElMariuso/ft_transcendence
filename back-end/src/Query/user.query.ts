import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserQuery
{
	constructor(private readonly prisma: PrismaClient) {}

	async findUserBydId(idUser: number)
	{
		return this.prisma.user.findUnique(
		{
			where: { idUser },
		});
	}
}
