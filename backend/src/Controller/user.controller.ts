import { BadRequestException, Body, ConflictException, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put } from '@nestjs/common';

import { UserService } from 'src/Service/user.service';
import { FriendService } from 'src/Service/friend.service';

import { UserDTO } from 'src/DTO/user/user.dto';
import { CreateUserDTO } from 'src/DTO/user/createUser.dto';
import { UpdateUserDTO } from 'src/DTO/user/updateUser.dto';
import { FriendBlockedDTO } from 'src/DTO/user/friendblocked.dto';

@Controller('users')
export class UserController
{
	constructor(private readonly userService: UserService, private readonly friendService: FriendService) {}

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
		let newId = parseInt(id, 10);
		return this.userService.findUserById(newId);
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
	async deleteUserById(@Param('id') id: string) : Promise<String>
	{
		let newId = parseInt(id, 10);
		const deletedUser = this.userService.deleteUser(newId);
		
		console.log(deletedUser);
		
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
	async updateUser(@Param('id') id: string, @Body() updateUserDTO : UpdateUserDTO): Promise<UserDTO>
	{
		try
		{
			let newId = parseInt(id, 10);
			return this.userService.updateUser(newId, updateUserDTO);
		}
		catch(error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException('User not found');

			throw new InternalServerErrorException('User update failed');
		}
	}

	/**
	 *	=========================================================
	 *  ======================== FRIENDS ========================
	 *	=========================================================
	 */

	/**
	 * Gets friends list of the user
	 * 
	 * @param id  id of the user
	 * 
	 * @returns FriendBlockedDTO[]
	 * 
	 * @throws HTTPException with status NOT_FOUND if the user is not found
	 * @throws HTTPException INTERNAL_SERVER_EXCEPTION if get the friends list failed
	 */
	@Get(':id/friends')
	async getFriendsByUserId(@Param('id') id: string) : Promise<FriendBlockedDTO[]>
	{
		try
		{
			let newId = parseInt(id, 10);
			return this.friendService.getFriendsByUserId(newId);
		}
		catch(error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException('User not found');

			throw new InternalServerErrorException('Gets friends list failed');
		}
	}

	@Post(':id/addFriend')
	async addFriend(@Param('id') id: string, @Body() username: string) : Promise<FriendBlockedDTO>
	{
		try
		{
			let newId = parseInt(id, 10);
			return this.friendService.addFriend(newId, username);
		}
		catch(error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException('User not found');
			
			throw new InternalServerErrorException('Adding friend failed');	
		}
	}

	@Put(':id/acceptFriendship')
	async acceptFriendship(@Param('id') id: string, @Body() idFriend: string)
	{
		try
		{
			let newId = parseInt(id, 10);
			let newFriendId = parseInt(idFriend, 10);
			return this.friendService.acceptFriendship(newId, newFriendId);
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException('User or Friendship not found');
			
			throw new InternalServerErrorException('Accept friendship failed');	
		}
	}

	@Put(':id/refuseFriendship')
	async refuseFriendship(@Param('id') id: string, @Body() idFriend: string)
	{
		try
		{
			let newId = parseInt(id, 10);
			let newFriendId = parseInt(idFriend, 10);
			return this.friendService.refuseFriendship(newId, newFriendId);
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException('User or Friendship not found');
			
			throw new InternalServerErrorException('Refuse friendship failed');	
		}
	}

	@Delete(':id/deleteFrienship')
	async deleteFriendship(@Param('id') id: string, @Body() idFriend: string)
	{
		try
		{
			let newId = parseInt(id, 10);
			let newFriendId = parseInt(idFriend, 10);
			return this.friendService.acceptFriendship(newId, newFriendId);
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException('User or Friendship not found');
			
			throw new InternalServerErrorException('Accept friendship failed');	
		}
	}

	/**
	 *	=========================================================
	 *  ======================== BLOCKED ========================
	 *	=========================================================
	 */
	/**
	 * Gets blocked users list of the user
	 * 
	 * @param id  id of the user
	 * 
	 * @returns FriendBlockedDTO[]
	 * 
	 * @throws HTTPException with status NOT_FOUND if the user is not found
	 * @throws HTTPException INTERNAL_SERVER_EXCEPTION if get the blocked users list failed
	 */
	@Get(':id/blocked')
	async getBlockedByUserId(@Param('id') id: string) : Promise<FriendBlockedDTO[]>
	{
		try
		{
			let newId = parseInt(id, 10);
			return this.userService.getBlockedsByUserId(newId);
		}
		catch(error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException('User not found');

			throw new InternalServerErrorException('Gets blocked users list failed');
		}
	}
}

