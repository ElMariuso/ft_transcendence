import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Friend, User } from '@prisma/client';

import { FriendQuery } from 'src/Query/friend.query'
import { UserQuery } from 'src/Query/user.query'
import { FriendBlockedDTO } from 'src/DTO/user/friendblocked.dto';

@Injectable()
export class FriendService
{
	constructor(private readonly friendQuery: FriendQuery, private readonly userQuery: UserQuery) {}

	
	async getFriendsByUserId(idUser: number) : Promise<FriendBlockedDTO[]>
	{
		const checkFriend = await this.userQuery.findUserById(idUser);

		if (!checkFriend)
			throw new NotFoundException();

		const friends = await this.friendQuery.getFriends(idUser);

		const formatFriends: FriendBlockedDTO[] = friends.map((friend) => {
			
			const {idUser, username, email} = friend;

			return {
				idUser,
				username,
				email,
			};
		});
		return formatFriends;
	}

	async addFriend(idUser: number, friendUsername: string) : Promise<FriendBlockedDTO>
	{
		const checkUser = await this.userQuery.findUserByUsername(friendUsername);

		if (!checkUser)
			throw new NotFoundException();

		const bond = await this.friendQuery.getFriendshipByUserIds(idUser, checkUser.idUser);
		
		if (bond)
			throw new ConflictException();
		
		const friend = await this.friendQuery.addFriend(idUser, checkUser.idUser);

		return this.transformToFriendBlockedDTO(checkUser);
	}

	async acceptFriendship(idUser: number, idFriendUser: number)
	{
		const checkUser = await this.userQuery.findUserById(idFriendUser);

		if (!checkUser)
			throw new NotFoundException();
		
		const bond = await this.friendQuery.getFriendshipByUserIds(idUser, checkUser.idUser);
		
		if (!bond)
			throw new NotFoundException();

		const newFriendship = await this.friendQuery.acceptFriendship(bond.idFriend);

		return this.transformToFriendBlockedDTO(checkUser);
	}

	async refuseFriendship(idUser: number, idFriendUser: number)
	{
		const checkUser = await this.userQuery.findUserById(idFriendUser);

		if (!checkUser)
			throw new NotFoundException();
		
		const bond = await this.friendQuery.getFriendshipByUserIds(idUser, checkUser.idUser);
		
		if (!bond)
			throw new NotFoundException();

		const refuseFriendship = await this.friendQuery.refuseFriendship(bond.idFriend);

		return this.transformToFriendBlockedDTO(checkUser);
	}

	async deleteFriendship(idUser: number, idFriendUser: number)
	{
		const checkUser = await this.userQuery.findUserById(idFriendUser);

		if (!checkUser)
			throw new NotFoundException();
		
		const bond = await this.friendQuery.getFriendshipByUserIds(idUser, checkUser.idUser);
		
		if (!bond)
			throw new NotFoundException();

		await this.friendQuery.deleteFriendship(bond.idFriend);

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
