import { BadRequestException, Body, ConflictException, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { UserService } from 'src/Service/user.service';
import { UserDTO } from 'src/DTO/user/user.dto';
import { CreateUserDTO } from 'src/DTO/user/createUser.dto';
import { UpdateUserDTO } from 'src/DTO/user/updateUser.dto';

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
	async findUserById(@Param('id') id: string) : Promise<UserDTO | null>
	{
		console.log("/users/:id called: " + id)
		let idInt = parseInt(id, 10);
		return await this.userService.findUserById(idInt);
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
	 * @throws HTTPException with status NOT_FOUND if the user is not found
	 */
	@Delete('/delete/:id')
	async deleteUserById(@Param('id') id: number) : Promise<String>
	{
		const deletedUser = this.userService.deleteUser(id);

		if (!deletedUser)
			throw new NotFoundException("User not found");
		
		return "User deleted successfully";
	}

	/**
	 * 
	 * Update a user
	 * 
	 * @param id id of the user
	 * @param updateUserDTO DTO containing data to update the user
	 * @returns UserDTO
	 * @throws HTTPException with status NOT_FOUND if the user is not found
	 * @throws HTTPException INTERNAL_SERVER_EXCEPTION if the update of the user failed
	 */
	@Put('/update/:id')
	async updateUser(@Param('id') id: number, @Body() updateUserDTO : UpdateUserDTO): Promise<UserDTO>
	{
		try
		{
			return this.userService.updateUser(id, updateUserDTO);
		}
		catch(error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException('User not found');

			throw new InternalServerErrorException('User update failed');
		}
	}
}

