import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

import { UserQuery } from 'src/Query/user.query';
import { FriendQuery } from 'src/Query/friend.query';

import { UserDTO } from 'src/DTO/user/user.dto';
import { CreateUserDTO } from 'src/DTO/user/createUser.dto';
import { UpdateUserDTO } from 'src/DTO/user/updateUser.dto';
import { FriendBlockedDTO } from 'src/DTO/user/friendblocked.dto';

import { ERROR_MESSAGES } from 'src/globalVariables';

@Injectable()
export class UserService
{
	constructor(private readonly userQuery: UserQuery, private readonly friendQuery: FriendQuery) {}

	/**
	 * Gets all the users
	 * 
	 * @returns All the users
	 */
	async findAllUsers(): Promise<User []>
	{
		return this.userQuery.findAllUsers();
	}

	/**
	 * Gets a user by his id
	 * 
	 * @param id  User's id to find
	 * 
	 * @returns UserDTO if the user is find, null otherwise
	 */
	async findUserById(id: number): Promise<UserDTO | null>
	{
		const user = await this.userQuery.findUserById(id);

		if (!user)
			return null;
		
		return this.transformToDTO(user);
	}

	/**
	 * Gets a user by his username
	 * 
	 * @param username  User's username to find
	 * 
	 * @returns UserDTO if the user is find, null otherwise
	 */
	async findUserByUsername(username: string) : Promise <UserDTO | null>
	{
		const user = await this.userQuery.findUserByUsername(username);

		if (!user)
			return null;
		
		return this.transformToDTO(user);
	}

	/**
	 * Gets a user by his 42 id
	 * 
	 * @param id  User's 42 id to find
	 * 
	 * @returns UserDTO if the user is find, null otherwise
	 */
	async findUserById42(id42: number) : Promise<UserDTO | null>
	{
		const user = await this.userQuery.findUserBy42Id(id42);

		if (!user)
			return null;
		
		return this.transformToDTO(user);
	}

	/**
	 * Get the list of all usernames
	 * 
	 * @returns List of usernames
	 */
	async findAllUsernames() : Promise<string []>
	{
		return this.userQuery.findAllUsernames();
	}

	/**
	 * Creates a user in DB
	 * 
	 * @param user UserDTO to create
	 * 
	 * @returns New User
	 * 
	 * @throws ConflictException if username already exists
	 */
	async createUser(user : CreateUserDTO) : Promise<UserDTO>
	{
		const existingUser = await this.userQuery.findUserByUsername(user.username);

		if (existingUser)
			throw new ConflictException(ERROR_MESSAGES.USER.USERNAME_ALREADY_EXIST);
		
		const newUser = await this.userQuery.createUser(user);

		return this.transformToDTO(newUser);
	}

	/**
	 * Delete a user based on their id
	 * 
	 * @param id User's id to delete
	 * 
	 * @returns The user deleted if the user was deleted successfully, null otherwise
	 */
	async deleteUser(id: number) : Promise<User | null>
	{
		const deletedUser = await this.userQuery.findUserById(id);

		if (!deletedUser)
			throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
		
		await this.userQuery.deleteUser(id);

		return deletedUser;
	}

	/**
	 * Updates a user in DB
	 * 
	 * @param id USer's id
	 * @param user UserDTO to update
	 * 
	 * @returns Updated User
	 * 
	 * @throws ConflictException if user is not found
	 */
	async updateUser(id: number, userData: UpdateUserDTO) : Promise<UserDTO>
	{
		const updateUser = await this.userQuery.findUserById(id);

		if (!updateUser)
			throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);

		const data = this.checkUpdateData(userData);

		if (data.username)
		{
			const check = await this.userQuery.findUserByUsername(data.username);
			if (check)
				throw new ConflictException(ERROR_MESSAGES.USER.USERNAME_ALREADY_EXIST);
		}

		await this.userQuery.updateUser(id, data);

		const updatedUser = await this.userQuery.findUserById(id);

		return this.transformToDTO(updatedUser);
	}

	async getFriendsByUserId(idUser: number) : Promise<FriendBlockedDTO[]>
	{
		const checkUser = await this.userQuery.findUserById(idUser);

		if (!checkUser)
			throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);

		const friends = await this.userQuery.getFriends(idUser);

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
			throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
		
		const friend = await this.friendQuery.addFriend(idUser, checkUser.idUser);

		return this.transformToFriendBlockUserDTO(checkUser);
	}

	async getBlockedsByUserId(idUser: number) : Promise<FriendBlockedDTO[]>
	{
		const checkUser = await this.userQuery.findUserById(idUser);

		if (!checkUser)
			throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);

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

	/**
	 * Transform a Prisma User Object to a UserDTO
	 * 
	 * @param user Prisma User Object
	 * 
	 * @returns UserDTO
	 */
	private transformToDTO(user: User): UserDTO
	{
		const userDTO: UserDTO =
		{
			idUser: user.idUser,
			username: user.username,
			email: user.email,
			points: user.points,
			isTwoFactorAuth: user.isTwoFactorAuth,
		};

		return userDTO;
	}

	/**
	 * Transform a Prisma User Object to a FriendBlockedDTO
	 * 
	 * @param user Prisma User Object
	 * 
	 * @returns FriendBlockedDTO
	 */
	private transformToFriendBlockUserDTO(user: User) : FriendBlockedDTO
	{
		const userDTO: FriendBlockedDTO = 
		{
			idUser: user.idUser,
			username: user.username,
			email: user.email
		};

		return userDTO;
	}

	private checkUpdateData(user: UpdateUserDTO) : any
	{
		const data : any = {};
		if (user.username !== null && user.username !== undefined)
			data.username = user.username;
		if (user.email !== null && user.email !== undefined)
			data.email = user.email;
		if (user.points !== null && user.points !== undefined)
			data.points = user.points;
		if (user.avatar !== null && user.avatar !== undefined)
			data.avatar = user.avatar;
		if (user.isTwoFactorAuth !== null && user.isTwoFactorAuth !== undefined)
			data.isTwoFactorAuth = user.isTwoFactorAuth;
		
		return data;
	}
}
