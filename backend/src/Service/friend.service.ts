import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

import { FriendQuery } from 'src/Query/friend.query'
import { UserQuery } from 'src/Query/user.query'
import { FriendBlockedDTO } from 'src/DTO/user/friendblocked.dto';

import { ERROR_MESSAGES } from 'src/globalVariables';
import { AchievementService } from './achievement.service';

@Injectable()
export class FriendService
{
	constructor(
		private readonly friendQuery: FriendQuery,
		private readonly userQuery: UserQuery,
		private readonly achievementService: AchievementService	
	) {}

	/**
	 * Get the friend list of the user
	 * 
	 * @param idUser User's id
	 * 
	 * @returns FriendBlockedDTO[]
	 */
	async getFriendsByUserId(idUser: number) : Promise<FriendBlockedDTO[]>
	{
		const checkFriend = await this.userQuery.findUserById(idUser);

		if (!checkFriend)
			throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);

		const friends = await this.friendQuery.getFriends(idUser);
		const formatFriends: FriendBlockedDTO[] = friends.map((friend) => 
		{
			const {idUser, username, email} = friend;

			return {
				idUser,
				username,
				email,
			};
		});
		return formatFriends;
	}

	/**
	 * Gets the friend invitations lists of the user
	 * 
	 * @param idUser User's id
	 * 
	 * @returns FriendBlockedDTO[]
	 */
	async getFriendsInvitationsByUserId(idUser: number) : Promise<FriendBlockedDTO[]>
	{
		const checkFriend = await this.userQuery.findUserById(idUser);

		if (!checkFriend)
			throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);

		const friends = await this.friendQuery.getFriendsInvitations(idUser);

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

	/**
	 * Send a friend invitation to a specific user
	 * 
	 * @param idUser User's id
	 * @param username Username of the user to invite
	 * 
	 * @returns FriendBlockedDTO
	 */
	async addFriend(idUser: number, username: string) : Promise<FriendBlockedDTO>
	{
		const checkUser = await this.userQuery.findUserByUsername(username);

		if (!checkUser)
			throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
		if (checkUser.idUser == idUser)
			throw new ConflictException(ERROR_MESSAGES.FRIEND.USER_TRYING_INVITE_ITSELF);
		
		const bond = await this.friendQuery.getFriendshipByUserIds(idUser, checkUser.idUser);
		
		/** DEMANDER SI ON ACCEPT DE RENVOYER UNE NOUVELLE DEMANDE SI ELLE A ETE REFUSEE */

		if (bond && bond.idStatus == 1)
			throw new ConflictException(ERROR_MESSAGES.FRIEND.IN_WAITING);
		if (bond && bond.idStatus == 2)
			throw new ConflictException(ERROR_MESSAGES.FRIEND.ALREADY_ACCEPTED);
		if (bond && bond.idStatus == 3)
			throw new ConflictException(ERROR_MESSAGES.FRIEND.ALREADY_REFUSED);
		
		const friend = await this.friendQuery.addFriend(idUser, checkUser.idUser);

		return this.transformToFriendBlockedDTO(checkUser);
	}

	/**
	 * Accepts a friend invitation from a specific user
	 * 
	 * @param idUser User's id
	 * @param idFriendUser New friend user's id
	 * 
	 * @returns FriendBlockedDTO
	 */
	async acceptFriendship(idUser: number, idFriendUser: number) : Promise<FriendBlockedDTO>
	{
		const checkUser = await this.userQuery.findUserById(idFriendUser);

		if (!checkUser)
			throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
		
		const bond = await this.friendQuery.getFriendshipByUserIds(idUser, checkUser.idUser);
		
		if (!bond)
			throw new NotFoundException(ERROR_MESSAGES.FRIEND.NOT_FOUND);
		if (bond.idUser == idUser)
			throw new ConflictException(ERROR_MESSAGES.FRIEND.USER_TRYING_ACCEPT);
		if (bond.idStatus == 2)
			throw new ConflictException(ERROR_MESSAGES.FRIEND.ALREADY_ACCEPTED);

		const newFriendship = await this.friendQuery.acceptFriendship(bond.idFriend);

		this.achievementService.checkAchievement(idUser, 2);

		return this.transformToFriendBlockedDTO(checkUser);
	}

	/**
	 * Refuse a friend invitation from a specific user
	 * 
	 * @param idUser User's id
	 * @param idFriendUser User's id who sent the invitation
	 * 
	 * @returns FriendBlockedDTO
	 */
	async refuseFriendship(idUser: number, idFriendUser: number): Promise<FriendBlockedDTO>
	{
		const checkUser = await this.userQuery.findUserById(idFriendUser);

		if (!checkUser)
			throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
		
		const bond = await this.friendQuery.getFriendshipByUserIds(idUser, checkUser.idUser);
		
		if (!bond)
			throw new NotFoundException(ERROR_MESSAGES.FRIEND.NOT_FOUND);
		if (bond.idUser == idUser)
			throw new ConflictException(ERROR_MESSAGES.FRIEND.USER_TRYING_REFUSE);
		if (bond.idStatus == 3)
			throw new ConflictException(ERROR_MESSAGES.FRIEND.ALREADY_REFUSED);

		const refuseFriendship = await this.friendQuery.refuseFriendship(bond.idFriend);

		return this.transformToFriendBlockedDTO(checkUser);
	}

	/**
	 * Delete a specific user from the friend list's user
	 * 
	 * @param idUser User's id
	 * @param idFriendUser Friend user's id to delete
	 * 
	 * @returns The deleted bond
	 */
	async deleteFriendship(idUser: number, idFriendUser: number)
	{
		const checkUser = await this.userQuery.findUserById(idFriendUser);

		if (!checkUser)
			throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
		
		const bond = await this.friendQuery.getFriendshipByUserIds(idUser, checkUser.idUser);
		
		if (!bond)
			throw new NotFoundException(ERROR_MESSAGES.FRIEND.NOT_FOUND);


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
