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

	/**
     * Gets a role by his name
     * 
     * @param name Role's name
     * 
     * @returns Role or null
     * 
     * @query select * from role where role.name = $name;
     */
	 async findRoleByName(name: string) : Promise<Role | null>
	 {
		 const role = await this.prisma.role.findFirst
		 (
			 {
				 where: { name },
			 }
		 );
		 
		 return role;
	 }
}
