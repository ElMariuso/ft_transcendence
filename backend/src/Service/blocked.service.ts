import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

import { BlockedQuery } from 'src/Query/blocked.query'
import { UserQuery } from 'src/Query/user.query'
import { FriendBlockedDTO } from 'src/DTO/user/friendblocked.dto';

@Injectable()
export class BlockedService
{
	constructor(private readonly blockedQuery: BlockedQuery, private readonly userQuery: UserQuery) {}

	async getBlockedsByUserId(idUser: number) : Promise<FriendBlockedDTO[]>
	{
		const checkUser = await this.userQuery.findUserById(idUser);

		if (!checkUser)
			throw new NotFoundException();

		const blockeds = await this.userQuery.getBlockeds(idUser);

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

	async blockUser(idUser: number, blockedUsername: string) : Promise<FriendBlockedDTO>
	{
		const checkUser = await this.userQuery.findUserByUsername(blockedUsername);

		if (!checkUser)
			throw new NotFoundException();

		const bond = await this.blockedQuery.getBlockedByUserIds(idUser, checkUser.idUser);
		
		if (bond)
			throw new ConflictException();
		
		await this.blockedQuery.addBlockedUser(idUser, checkUser.idUser);

		return this.transformToFriendBlockedDTO(checkUser);
	}

	async deleteBlocked(idUser: number, idBlockedUser: number)
	{
		const checkUser = await this.userQuery.findUserById(idBlockedUser);

		if (!checkUser)
			throw new NotFoundException();
		
		const bond = await this.blockedQuery.getBlockedByUserIds(idUser, checkUser.idUser);
		
		if (!bond)
			throw new NotFoundException();

		await this.blockedQuery.deleteBlocked(bond.idFriend);

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
