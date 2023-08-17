import { BadRequestException, Body, ConflictException, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post } from '@nestjs/common';
import { UserService } from '../Service/user.service';
import { UserDTO } from '../DTO/user.dto';
import { CreateUserDTO } from '../DTO/createUser.dto';

@Controller('users')
export class UserController
{
	constructor(private readonly userService: UserService) {}

	/**
	 * Get all Users
	 * 
	 * @returns all Users
	 */
	@Get()
	async getAllUsers()
	{
		return this.userService.findAllUsers();
	}

	/**
	 * Gets a user by his id
	 * 
	 * @param id User's id to find
	 * 
	 * @returns UserDTO or null
	 */
	@Get(':id')
	async findUserById(@Param('id') id: number) : Promise<UserDTO | null>
	{
		return this.userService.findUserById(id);
	}

	/**
	 * Create a new user in database
	 * 
	 * @param createUserDTO DTO containing data to create the new user
	 * 
	 * @returns UserDTO
	 * @throws HTTPException with status BAD_REQUEST if the username already exists
	 * @Throws HTTPException INTERNAL_SERVER_EXCEPTION if the creation of the user failed
	 */
	@Post()
	async createUser(@Body() createUserDTO : CreateUserDTO): Promise<UserDTO>
	{
		try
		{
			return this.userService.createUser(createUserDTO);
		}
		catch(error)
		{
			if (error instanceof ConflictException)
				throw new BadRequestException('Username already exists');

			throw new InternalServerErrorException('User creation failed');
		}
	}

	/**
	 * Delete a user by his id
	 * 
	 * @param id User's id to delete
	 * 
	 * @returns Message in a string
	 */
	@Delete('/delete/:id')
	async deleteUserById(@Param('id') id: number) : Promise<String>
	{
		const deletedUser = this.userService.deleteUser(id);

		if (!deletedUser)
			throw new NotFoundException("User not found");
		
		return "User deleted successfully";
	}
}
