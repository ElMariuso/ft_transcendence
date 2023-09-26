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
	 */
	 async findUserBy42Id(id42: number)
	 {
		 return this.prisma.user.findUnique(
		 {
			 where: { id42: id42 },
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
		const { username, email, id42 } = user;

		const newUser = await this.prisma.user.create(
		{
			data: 
			{
				username,
				email: "test@test.com",
				id42,
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

	async updateUser(idUser: number, updateData: any)
	{
		this.prisma.user.update(
		{
			where: { idUser },
			data: updateData
		}
		);
	}
}
