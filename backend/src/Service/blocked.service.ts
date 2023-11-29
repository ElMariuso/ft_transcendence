import { ConflictException, Injectable, BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';

import { BlockedQuery } from 'src/Query/blocked.query'
import { UserQuery } from 'src/Query/user.query'
import { FriendBlockedDTO } from 'src/DTO/user/friendblocked.dto';

import { ERROR_MESSAGES } from 'src/globalVariables';

@Injectable()
export class BlockedService
{
	constructor(private readonly blockedQuery: BlockedQuery, private readonly userQuery: UserQuery) {}

	/**
	 * Gets blocked users list of the user
	 * 
	 * @param idUser User's id
	 * 
	 * @returns FriendBlockedDTO[]
	 */

	async getBlockedsByUserId(idUser: number) : Promise<FriendBlockedDTO[]>
	{
		const checkUser = await this.userQuery.findUserById(idUser);

		if (!checkUser)
			throw new BadRequestException(ERROR_MESSAGES.USER.NOT_FOUND);

		const blockeds = await this.blockedQuery.getBlockeds(idUser);

		const formatBlockeds: FriendBlockedDTO[] = blockeds.map((blocked) => {
			
			const {idUser, username, email} = blocked;

			return {
				idUser,
				username,
				email,
			};
		});
		return formatBlockeds;
	}

	/**
	 * Block a specific user based on his name
	 * 
	 * @param idUser User's id
	 * @param blockedUsername Username of the user that we want to block
	 * 
	 * @returns FriendBlockedDTO
	 */
	async blockUser(idUser: number, blockedUsername: string) : Promise<FriendBlockedDTO>
	{
		const checkUser = await this.userQuery.findUserByUsername(blockedUsername);

		if (!checkUser)
			throw new BadRequestException(ERROR_MESSAGES.USER.NOT_FOUND);


		const bond = await this.blockedQuery.getBlockedByUserIds(idUser, checkUser.idUser);
		
		if (bond)
			throw new ConflictException(ERROR_MESSAGES.BLOCK.ALREADY_BLOCK);

		
		await this.blockedQuery.addBlockedUser(idUser, checkUser.idUser);

		return this.transformToFriendBlockedDTO(checkUser);
	}

	/**
	 * Delete a specific user's block
	 * 
	 * @param idUser User's id
	 * @param idBlockedUser Blocked user's id
	 * 
	 * @returns Bond deleted
	 */
	async deleteBlocked(idUser: number, idBlockedUser: number)
	{
		const checkUser = await this.userQuery.findUserById(idBlockedUser);

		if (!checkUser)
			throw new BadRequestException(ERROR_MESSAGES.USER.NOT_FOUND);
		
		const bond = await this.blockedQuery.getBlockedByUserIds(idUser, checkUser.idUser);

		if (!bond)
			throw new BadRequestException(ERROR_MESSAGES.BLOCK.NOT_FOUND);

		await this.blockedQuery.deleteBlocked(bond.idBlock);

		return bond;
	}

	/**
	 * Transform a Prisma Friend Object to a FriendBlockedDTO
	 * 
	 * @param Friend Prisma Friend Object
	 * 
	 * @returns FriendBlockedDTO
	 */
	 private transformToFriendBlockedDTO(user: User) : FriendBlockedDTO
	 {
		 const userDTO: FriendBlockedDTO = 
		 {
			 idUser: user.idUser,
			 username: user.username,
			 email: user.email
		 };
 
		 return userDTO;
	 }
}
