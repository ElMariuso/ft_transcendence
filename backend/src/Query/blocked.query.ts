import { Injectable } from '@nestjs/common';
import { PrismaClient, Blocked } from '@prisma/client';

@Injectable()
export class BlockedQuery
{
	constructor(private readonly prisma: PrismaClient) {}

	/**
	  * Gets all blocked users of a specific user
	  * 
	  * @param idUser User's id
	  * 
	  * @returns Array of users
	  * 
	 * @query select * from user inner join block on block.idUser = $idUser where block.idUser = $idUser;
	  */
	 async getBlockeds(idUser: number)
	 {
		 const user = await this.prisma.user.findUnique({
			 where: { idUser },
			 include: {
			   Blocked: {
				 include: {
				   BlockedUser: true,
				 },
			   },
			 },
		   });
		 
		 return user.Blocked.map((blocked)  => blocked.BlockedUser);
	 }

	/**
	 * Get a blocked relation by his user's id and the blocked user's id
	 * 
	 * @param idUser User's id
	 * @param idBlockedUser Blocked user's id
	 * 
	 * @returns the blocked relation
	 * 
	 * @query select * from block where block.idUser = $idUser and block.idBlockedUser = $idBlockedUser;
	 */
	async getBlockedByUserIds(idUser: number, idBlockedUser: number) : Promise<Blocked | null>
	{
		let blocked = await this.prisma.blocked.findFirst
		(
			{
				where: 
				{
					idUser: idUser,
					idBlockedUser: idBlockedUser
				},
			}
		);

		return blocked;
	}

	/**
	 * Post a new blocked relation in DB
	 * 
	 * @param idUser  User's id
	 * @param idBlockedUser User's id to block
	 * 
	 * @returns new Blocked
	 * 
	 * @query insert into block (idUser, idBlockedUser) values ($idUser, $idBlockedUser);
	 */
	async addBlockedUser(idUser: number, idBlockedUser: number) : Promise<Blocked>
	{
		const blocked = await this.prisma.blocked.create
		(
			{
				data:
				{
					idUser,
					idBlockedUser,
				},
			}
		);
		return blocked;
	}

	/**
	 * Delete a blocked relation in DB
	 * 
	 * @param idBlocked Blocked relation's id to delete
	 * 
	 * @query delete from block where block.idBlocked = $idBlocked;
	 */
	async deleteBlocked(idBlocked: number)
	{
		await this.prisma.blocked.delete
		(
			{
				where: { idBlocked },
			}
		);
	}
}
