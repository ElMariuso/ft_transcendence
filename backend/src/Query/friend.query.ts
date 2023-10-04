import { Injectable } from '@nestjs/common';
import { PrismaClient, Friend } from '@prisma/client';

@Injectable()
export class FriendQuery
{
	constructor(private readonly prisma: PrismaClient) {}

	/**
	 * Gets all friends of a specific user if the friendship relation is 'Accepted'
	 * 
	 * @param idUser User's id
	 * 
	 * @returns Array of users
	 * 
	 * @query select * from user inner join friend on (friend.idUser = $idUser or friend.idFriendUser = $idUser) where friend.idUser = $idUser or friend.idFriendUser = $idUser and friend.idStatus = 2;
	 */
	async getFriends(idUser: number)
	{
		const friends1 = await this.prisma.friend.findMany
		(
			{
				where:
				{
					idStatus: 2,
					idUser,
				}
			}
		);

		const friends2 = await this.prisma.friend.findMany
		(
			{
				where:
				{
					idStatus: 2,
					idFriendUser: idUser,
				}
			}
		);

		const friends = [...friends1, ...friends2];
		const friendsIds = friends.map(friend =>
		(
			friend.idUser === idUser ? friend.idFriendUser : friend.idUser
		)
		);

		const user = await this.prisma.user.findMany
		(
			{
				where:
				{
					idUser:
					{
						in: friendsIds,
					}
				}
			}
		);

		return user;
	}

	/**
	 * Gets all friends invitations for a specific user
	 * 
	 * @param idUser User's id
	 * 
	 * @returns Array of users
	 * 
	 * @query select * from user inner join friend on (friend.idUser = $idUser or friend.idFriendUser = $idUser) where friend.idUser = $idUser or friend.idFriendUser = $idUser and friend.idStatus = 1;
	 */
	async getFriendsInvitations(idUser: number)
	{
		const friends1 = await this.prisma.friend.findMany
		(
			{
				where:
				{
					idStatus: 1,
					idUser,
				}
			}
		);

		const friends2 = await this.prisma.friend.findMany
		(
			{
				where:
				{
					idStatus: 1,
					idFriendUser: idUser,
				}
			}
		);

		const friends = [...friends1, ...friends2];
		const friendsIds = friends.map(friend =>
		(
			friend.idUser === idUser ? friend.idFriendUser : friend.idUser
		)
		);

		const user = await this.prisma.user.findMany
		(
			{
				where:
				{
					idUser:
					{
						in: friendsIds,
					}
				}
			}
		);

		return user;
	}

	/**
	 * Get a friendship relation by his user's id and the friend user's id
	 * 
	 * @param idUser User's id
	 * @param idFriendUser Friend user's id
	 * 
	 * @returns The friendship relation
	 * 
	 * @query select * from friend where friend.idUser = $idUser and friend.idFriendUser = $idFriendUser;
	 * @optional_query select * from friend where friend.idUser = $idFriendUser and friend.idFriendUser = $idUser;
	 */
	async getFriendshipByUserIds(idUser: number, idFriendUser: number) : Promise<Friend | null>
	{
		let friend = await this.prisma.friend.findFirst
		(
			{
				where: 
				{
					idUser: idUser,
					idFriendUser: idFriendUser
				},
			}
		);

		if (!friend)
		{
			friend = await this.prisma.friend.findFirst
			(
				{
					where: 
					{
						idUser: idFriendUser,
						idFriendUser: idUser
					},
				}
			)
		}

		return friend;
	}

	/**
	 * Post a friendship relation in DB
	 * 
	 * @param idUser User's id
	 * @param idFriendUser Friend user's id
	 * 
	 * @returns The new Friendship relation
	 * 
	 * @query insert into friend (idUser, idFriendUser, idStatus) values ($idUser, $idFriendUser, 1);
	 */
	async addFriend(idUser: number, idFriendUser: number) : Promise<Friend>
	{
		const friend = await this.prisma.friend.create
		(
			{
				data:
				{
					idUser,
					idFriendUser,
					idStatus : 1,
				},
			}
		);
		return friend;
	}

	/**
	 * Update the status of the friendship relation to 'Accepted'
	 * 
	 * @param idFriend Friendship relation's id
	 * 
	 * @returns The updated friendship relation
	 * 
	 * @query update friend set idStatus = 2 where friend.idFriend = $idFriend;
	 */
	async acceptFriendship(idFriend: number) : Promise<Friend>
	{
		const friend = await this.prisma.friend.update
		(
			{
				where: { idFriend },
				data:
				{
					idStatus: 2
				},
			}
		);

		return friend;
	}

	/**
	 * Update the status of the friendship relation to 'Refused'
	 * 
	 * @param idFriend Friendship relation's id
	 * 
	 * @returns The updated friendship relation
	 * 
	 * @query update friend set idStatus = 3 where friend.idFriend = $idFriend;
	 */
	async refuseFriendship(idFriend: number) : Promise<Friend>
	{
		const friend = await this.prisma.friend.update
		(
			{
				where: { idFriend },
				data:
				{
					idStatus: 3
				},
			}
		);

		return friend;
	}

	/**
	 * Delete the specified friendship relation
	 * 
	 * @param idFriend Friendship relation's id
	 * 
	 * @query delete from friend where friend.idFriend = $idFriend;
	 */
	async deleteFriendship(idFriend: number)
	{
		await this.prisma.friend.delete
		(
			{
				where: { idFriend },
			}
		);
	}
}
