import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { CreateUserDTO } from 'src/DTO/user/createUser.dto';

@Injectable()
export class UserQuery
{
	constructor(private readonly prisma: PrismaClient) {}

	/**
	 * Gets all the users
	 * 
	 * @returns All Users
	 * 
	 * @query select * from user;
	 */
	async findAllUsers()
	{
		return this.prisma.user.findMany();
	}

	/**
	 * Gets a user by his id
	 * 
	 * @param idUser user's id to find
	 * 
	 * @returns User if the id match, null otherwise
	 * 
	 * @query select * from user where user.idUser = $idUser;
	 */
	async findUserById(idUser: number)
	{
		return this.prisma.user.findUnique(
		{
			where: { idUser },
		});
	}

	/**
	 * Gets a user by his username
	 * 
	 * @param username User's username to find
	 * 
	 * @returns User if the username match, null otherwise
	 * 
	 * @query select * from user where user.username = $username;
	 */
	async findUserByUsername(username: string)
	{

		return this.prisma.user.findUnique(
		{
			where: { username: username },
		});
	}

	/**
	 * Gets a user by his id
	 * 
	 * @param idUser user's id to find
	 * 
	 * @returns User if the id match, null otherwise
	 * 
	 * @query select * from user where user.id42 = $id42;
	 */
	async findUserBy42Id(id42: number)
	{
		return this.prisma.user.findUnique(
		{
			where: { id42: id42 },
		});
	}

	/**
	 * Gets the list of all usernames
	 * 
	 * @returns List of usernames
	 * 
	 * @query select username from user;
	 */
	async findAllUsernames()
	{
		const users = await this.prisma.user.findMany();
		const usernames = users.map(user => user.username);
		return usernames;
	}

	/**
	 * Posts a new user in DB
	 * 
	 * @param user CreateUserDTO
	 * 
	 * @returns New User
	 * 
	 * @query insert into user (username, email, avatar, points, isTwoFactorAuth, id42) values ($username, $email, 'default', 0, false, $id42)
	 */
	async createUser(user: CreateUserDTO) : Promise<User>
	{
		// Deconstruction de l'objet CreateUserDTO
		const { username, email, id42 } = user;
		
		const newUser = await this.prisma.user.create
		(
			{
				data: 
				{
					username,
					email,
					avatar: 'default',
					points: 0,
					isTwoFactorAuth: false,
					id42
				},
			}
		);

		return newUser;
	}

	/**
	 * Delete a user based on his id and all his datas (friends, blocked, channel appartenance)
	 * 
	 * @param idUser User's id to delete
	 * 
	 * @query delete from user where user.idUser = $idUser; 
	 */
	async deleteUser(idUser: number)
	{
		await this.prisma.user.delete
		(
			{
				where : { idUser }
			}
		);

		await this.prisma.user_Channel.deleteMany
		(
			{
				where: { idUser },
			}
		);

		await this.prisma.friend.deleteMany
		(
			{
				where: { idUser },
			}
		);

		await this.prisma.friend.deleteMany
		(
			{
				where: { idFriendUser: idUser},
			}
		);

		// await this.prisma.friend.deleteMany
		// (
		// 	{
		// 		OR: 
		// 		[
		// 			{ idUser },
		// 			{ idFriendUser: idUser}
		// 		],
		// 	}
		// )


		await this.prisma.block.deleteMany
		(
			{
				where: { idUser: idUser},
			}
		);
		await this.prisma.block.deleteMany
		(
			{
				where: { idBlockedUser: idUser},
			}
		);

		// await this.prisma.block.deleteMany
		// (
		// 	{
		// 		OR:
		// 		[
		// 			{ idUser },
		// 			{ idBlockedUser: idUser}
		// 		]
		// 	}
		// )
	}

	/**
	 * Update a user based on data to update
	 * 
	 * @param idUser User'id to update
	 * @param updateData Data to update
	 * 
	 * @query update user set $updateData where user.idUser = $idUser;
	 */
	async updateUser(idUser: number, updateData: any)
	{
		await this.prisma.user.update
		(
			{
				where: { idUser },
				data: updateData
			}
		);
	}

	/**
	 * Gets all friends of a specific user
	 * 
	 * @param idUser User's id
	 * 
	 * @returns Array of users
	 * 
	 * @query select * from user where user.idUser = $idUser inner join friend on friend.idUser = $idUser;
	 */
	async getFriends(idUser: number)
	{
		const user = await this.prisma.user.findUnique
		(
			{
				where: { idUser },
				include:
				{
					Friend: 
					{
						include: {
						FriendUser: true,
						},
					},
				},
			}
		);
		
		return user.Friend.map((friend) => friend.FriendUser);
	}

	/**
	 * Gets all blocked users of a specific user
	 * 
	 * @param idUser User's id
	 * 
	 * @returns Array of users
	 * 
	 * @query select * from user where user.idUser = $idUser inner join block on block.idUser = $idUser;
	 */
	async getBlockeds(idUser: number)
	{
		const user = await this.prisma.user.findUnique
		(
			{
				where: { idUser },
				include:
				{
					Blocked:
					{
						include: { BlockedUser: true, },
					},
				},
		}
		);
		
		return user.Blocked.map((blocked)  => blocked.BlockedUser);
	}
}
