import { Injectable } from '@nestjs/common';
import { PrismaClient, Block } from '@prisma/client';

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
		const blockeds = await this.prisma.block.findMany
		(
			{
				where: { idUser },
			}
		);
		const idBlocked = blockeds.map(blocked => blocked.idBlockedUser);
		
		const users = await this.prisma.user.findMany
		(
			{
				where:
				{
					idUser:
					{
						in: idBlocked,
					}
				}
			}
		);

		return users;
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
	async getBlockedByUserIds(idUser: number, idBlockedUser: number) : Promise<Block | null>
	{
		let blocked = await this.prisma.block.findFirst
		(
			{
				where: 
				{
					idUser,
					idBlockedUser
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
	async addBlockedUser(idUser: number, idBlockedUser: number) : Promise<Block>
	{
		const blocked = await this.prisma.block.create
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
	 * @param idBlock Blocked relation's id to delete
	 * 
	 * @query delete from block where block.idBlocked = $idBlocked;
	 */
	async deleteBlocked(idBlock: number)
	{
		await this.prisma.block.delete
		(
			{
				where: { idBlock },
			}
		);
	}
}
