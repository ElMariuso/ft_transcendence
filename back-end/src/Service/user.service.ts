import { ConflictException, Injectable } from '@nestjs/common';
import { UserQuery } from '../Query/user.query';
import { User } from '@prisma/client';
import { CreateUserDTO } from '../DTO/createUser.dto';
import { UserDTO } from '../DTO/user.dto';

@Injectable()
export class UserService
{
	constructor(private readonly userQuery: UserQuery) {}

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
		const user = await this.userQuery.findUserBydId(id);

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
			throw new ConflictException();
		
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
		const deletedUser = await this.userQuery.findUserBydId(id);

		if (!deletedUser)
			return null;
		
		await this.userQuery.deleteUser(id);

		return deletedUser;
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
			password: user.password,
			points: user.points,
			isTwoFactorAuth: user.isTwoFactorAuth,
		};

		return userDTO;
	}
}
