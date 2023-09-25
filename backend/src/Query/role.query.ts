import { Injectable } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';

@Injectable()
export class RoleQuery
{
	constructor(private readonly prisma: PrismaClient) {}

	/**
	 * Get a role by his id
	 * 
	 * @param idRole Role's id
	 * 
	 * @query select * from role where role.idRole = $idRole;
	 */
	async findRoleById(idRole: number) : Promise<Role | null>
	{
		const role = await this.prisma.role.findUnique
		(
			{
				where: { idRole },
			}
		);
		
		return role;
	}
}
