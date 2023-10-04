import { BadRequestException, Body, ConflictException, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put } from '@nestjs/common';

import { UserService } from 'src/Service/user.service';
import { FriendService } from 'src/Service/friend.service';
import { BlockedService } from 'src/Service/blocked.service';

import { UserDTO } from 'src/DTO/user/user.dto';
import { CreateUserDTO } from 'src/DTO/user/createUser.dto';
import { UpdateUserDTO } from 'src/DTO/user/updateUser.dto';
import { FriendBlockedDTO } from 'src/DTO/user/friendblocked.dto';

import { ERROR_MESSAGES } from 'src/globalVariables';
import { MESSAGES } from '../globalVariables';

@Controller('users')
export class UserController
{
	constructor(
		private readonly userService: UserService,
		private readonly friendService: FriendService,
		private readonly blockedService: BlockedService
		) {}

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
	@Get('/user/:id')
	async findUserById(@Param('id') id: string) : Promise<UserDTO | null>
	{
		console.log("path :id");
		let newId = parseInt(id, 10);
		return this.userService.findUserById(newId);
	}

	/**
	 * Get all usernames
	 * 
	 * @returns List of usernames
	 */
	@Get('/usernames')
	async findAllUsernames() : Promise<string []>
	{
		console.log("Path : /usernames");
		return this.userService.findAllUsernames();
	}

	/**
	 * Create a new user in database
	 * 
	 * @param createUserDTO DTO containing data to create the new user
	 * 
	 * @returns UserDTO
	 * 
	 * @throw HTTPException with status BAD_REQUEST if the username already exists
	 * @throw HTTPException with status INTERNAL_SERVER_EXCEPTION if the creation of the user failed
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
				throw new ConflictException(error.message);

			throw new InternalServerErrorException(ERROR_MESSAGES.USER.CREATION_FAILED);
		}
	}

	/**
	 * Delete a user by his id
	 * 
	 * @param id User's id to delete
	 * 
	 * @returns Message in a string
	 * 
	 * @throw HTTPException with status NOT_FOUND if the user is not found
	 * @throw HTTPException with status NOT_FOUND if the user is not found
	 * @throw HTTPException with status INTERNAL_SERVER_EXCEPTION if the deletion of the user failed
	 */
	@Delete('/delete/:id')
	async deleteUserById(@Param('id') id: string) : Promise<String>
	{
		try
		{
			let newId = parseInt(id, 10);
			const user = this.userService.deleteUser(newId);
			return MESSAGES.USER.DELETE_SUCCESS;
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);
			throw new InternalServerErrorException(ERROR_MESSAGES.USER.DELETION_FAILED);
		}
	}

	/**
	 * 
	 * Update a user
	 * 
	 * @param id id of the user
	 * @param updateUserDTO DTO containing data to update the user
	 * 
	 * @returns UserDTO
	 * 
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
				throw new NotFoundException(error.message);

			throw new InternalServerErrorException(ERROR_MESSAGES.USER.UPDATE_FAILED);
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
				throw new NotFoundException(error.message);

			throw new InternalServerErrorException(ERROR_MESSAGES.FRIEND.GETFRIENDS_FAILED);
		}
	}

	/**
	 * Gets the friend invitations lists of the user
	 * 
	 * @param idUser User's id
	 * 
	 * @returns FriendBlockedDTO[]
	 * 
	 * @throw HTTPException with status NOT_FOUND id the user is not found
	 * @throw HTTPException with status INTERNAL_SERVER_EXCEPTION if get the friend invitation list failed
	 */
	@Get(':id/getInvitations')
	async getFriendsInvitationsByUserId(@Param('id') id:string)
	{
		try
		{
			let newId = parseInt(id, 10);
			return this.friendService.getFriendsInvitationsByUserId(newId);
		}
		catch(error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);

			throw new InternalServerErrorException(ERROR_MESSAGES.FRIEND.GETINVITATIONS_FAILED);
		}
	}

	/**
	 * Send a friend invitation to a specific user
	 * 
	 * @param id User's id
	 * @param username Username of the user to invite
	 * 
	 * @returns FriendBlockedDTO
	 * 
	 * @throw HTTPException with status NOT_FOUND if the user is not found
	 * @throw HTTPException with status CONFLICT if the bond already exists
	 * @throw HTTPException with status INTERNAL_SERVER_EXCEPTION if the creation of the invitation failed
	 */
	@Post(':id/addFriend')
	async addFriend(@Param('id') id: string, @Body() data : { username: string }) : Promise<FriendBlockedDTO>
	{
		try
		{
			let newId = parseInt(id, 10);
			return this.friendService.addFriend(newId, data.username);
		}
		catch(error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);
			if (error instanceof ConflictException)
				throw new ConflictException(error.message);
			throw new InternalServerErrorException(ERROR_MESSAGES.FRIEND.ADDFRIEND_FAILED);	
		}
	}

	/**
	 * Accepts a friend invitation from a specific user
	 * 
	 * @param id User's id
	 * @param idFriend New friend user's id
	 * 
	 * @returns FriendBlockedDTO
	 *
	 * @throw HTTPException with status NOT_FOUND if the user is not found
	 * @throw HTTPException with status NOT_FOUND if the invitation is not found
	 * @throw HTTPException with status CONFLICT if the user has already accepted the invitation
	 * @throw HTTPException with status CONFLICT if the user who sent the invitation tried to accept it
	 * @throw HTTPException with status CONFLICT if the invitation is in waiting
	 * @throw HTTPException with status CONFLICT if the invitation is accepted
	 * @throw HTTPException with status CONFLICT if the invitation is refused
	 * @throw HTTPException with status INTERNAL_SERVER_EXCEPTION if the acceptance failed
	 */
	@Put(':id/acceptFriendship')
	async acceptFriendship(@Param('id') id: string, @Body() data: { idFriend: string })
	{
		try
		{
			let newId = parseInt(id, 10);
			let newFriendId = parseInt(data.idFriend, 10);
			return this.friendService.acceptFriendship(newId, newFriendId);
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);
			if (error instanceof ConflictException)
				throw new ConflictException(error.message);
			throw new InternalServerErrorException(ERROR_MESSAGES.FRIEND.ACCEPTFRIEND_FAILED);	
		}
	}

	/**
	 * Accepts a friend invitation from a specific user
	 * 
	 * @param id User's id
	 * @param idFriend New friend user's id
	 * 
	 * @returns FriendBlockedDTO
	 *
	 * @throw HTTPException with status NOT_FOUND if the user is not found
	 * @throw HTTPException with status NOT_FOUND if the invitation is not found
	 * @throw HTTPException with status CONFLICT if the user has already accepted the invitation
	 * @throw HTTPException with status CONFLICT if the user who sent the invitation tried to accept it
	 * @throw HTTPException with status INTERNAL_SERVER_EXCEPTION if the denial failed
	 */
	@Put(':id/refuseFriendship')
	async refuseFriendship(@Param('id') id: string, @Body() data: { idFriend: string })
	{
		try
		{
			let newId = parseInt(id, 10);
			let newFriendId = parseInt(data.idFriend, 10);
			return this.friendService.refuseFriendship(newId, newFriendId);
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);
			if (error instanceof ConflictException)
				throw new ConflictException(error.message);
			throw new InternalServerErrorException(ERROR_MESSAGES.FRIEND.REFUSEFRIEND_FAILED);	
		}
	}

	/**
 	 * Delete a specific user from the friend list's user
	 * 
	 * @param id User's id
	 * @param idFriend Friend user's id to delete
	 * 
	 * @returns The deleted bond
	 * 
	 * @throw HTTPException with status NOT_FOUND if the user is not found
	 * @throw HTTPException with status NOT_FOUND if the bond is not found
	 * @throw HTTPException with status INTERNAL_SERVER_EXCEPTION if the deletion failed
	 */
	@Delete(':id/deleteFriendship')
	async deleteFriendship(@Param('id') id: string, @Body() data: { idFriend: string })
	{
		try
		{
			let newId = parseInt(id, 10);
			let newFriendId = parseInt(data.idFriend, 10);
			return this.friendService.deleteFriendship(newId, newFriendId);
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);
			
			throw new InternalServerErrorException(ERROR_MESSAGES.FRIEND.DELETEFRIEND_FAILED);	
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
			return this.blockedService.getBlockedsByUserId(newId);
		}
		catch(error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);

			throw new InternalServerErrorException(ERROR_MESSAGES.BLOCK.GETBLOCK_FAILED);
		}
	}

	/**
	 * Block a specific user based on his name
	 * 
	 * @param idUser User's id
	 * @param blockedUsername Username of the user that we want to block
	 * 
	 * @returns FriendBlockedDTO
	 * 
	 * @throw HTTPException with status NOT_FOUND if the user is not found
	 * @throw HTTPException with status CONFLICT if the relation already exists
	 * @throw HTTPException with status INTERNAL_SERVER_EXCEPTION if the creation of the relation failed
	 */
	@Post(':id/blockUser')
	async blockUser(@Param('id') id: string, @Body() data: { username:string }) : Promise<FriendBlockedDTO>
	{
		try
		{
			let newId = parseInt(id, 10);
			return this.blockedService.blockUser(newId, data.username);
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);
			if (error instanceof ConflictException)
				throw new ConflictException(error.message);

			throw new InternalServerErrorException(ERROR_MESSAGES.BLOCK.BLOCKUSER_FAILED);
		}
	}

	/**
	 * Delete a specific user's block
	 * 
	 * @param id User's id
	 * @param idBlock Blocked user's id
	 * 
	 * @returns Bond deleted
	 * 
	 * @throw HTTPException with status NOT_FOUND if the user is not found
	 * @throw HTTPException with status NOT_FOUND if the relation is not found
	 * @throw HTTPException with status INTERNAL_SERVER_EXCEPTION if the deletion failed
	 */
	@Delete(':id/deleteBlock')
	async deleteBlocked(@Param('id') id: string, @Body() data: { idBlock: number })
	{
		try
		{
			let newId = parseInt(id, 10);
			return this.blockedService.deleteBlocked(newId, data.idBlock);
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);

			throw new InternalServerErrorException(ERROR_MESSAGES.BLOCK.BLOCKUSER_FAILED);
		}
	}

}

