import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { CreateUserDTO } from 'src/DTO/createUser.dto';

@Injectable()
export class UserQuery
{
	constructor(private readonly prisma: PrismaClient) {}

	/**
	 * Gets all the users
	 * 
	 * @returns All Users
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
	 */
	async findUserBydId(idUser: number)
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
	 */
	async findUserByUsername(username: string)
	{
		return this.prisma.user.findUnique(
		{
			where: { username },
		});
	}

	/**
	 * Posts a new user in DB
	 * 
	 * @param user CreateUserDTO
	 * 
	 * @returns New User
	 */
	async createUser(user: CreateUserDTO) : Promise<User>
	{
		// Deconstruction de l'objet CreateUserDTO
		const { username, email, password } = user;

		const newUser = await this.prisma.user.create(
		{
			data: 
			{
				username,
				email,
				password,
				avatar: 'default',
				points: 0,
				isTwoFactorAuth: false,
			},
		});

		return newUser;
	}

	/**
	 * Delete a user based on his id
	 * 
	 * @param idUser User's id to delete
	 */
	async deleteUser(idUser: number)
	{
		this.prisma.user.delete(
		{
			where : { idUser }
		}
		);
	}
}
