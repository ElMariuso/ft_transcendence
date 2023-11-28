import {	Controller, Body, Param, 
			Get, Post, Put, Delete, 
			InternalServerErrorException, NotFoundException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';

import { UserChannelService } from 'src/Service/userchannel.service';

import { ChannelDTO } from 'src/DTO/channel/channel.dto';
import { UserChannelDTO } from 'src/DTO/userchannel/userchannel.dto';
import { CreateUserChannelDTO } from 'src/DTO/userchannel/createUserChannel.dto';
import { UpdateRoleUserChannelDTO } from 'src/DTO/userchannel/updateRoleUserChannel.dto';
import { UpdateMuteTimeUserChannelDTO } from 'src/DTO/userchannel/updateMuteTimeUserChannel.dto';

import { ERROR_MESSAGES, MESSAGES } from 'src/globalVariables';


@Controller('userchannels')
export class UserChannelController
{
	constructor(
		private readonly userchannelService: UserChannelService) {}


	/**
	 * Gets all channel for a user's id
	 * 
	 * @param id User's id
	 * 
	 * @returns All channels for the user's id
	 * 
	 * @throws HTTPException NOT_FOUND if the user is not found
	 * @throws HTTPException INTERNAL_SERVER_EXCEPTION if generating the list failed
	 */
	@Get(':id')
	async findAllChannelsByUserId(@Param('id') id: string) : Promise<ChannelDTO[]>
	{
		try
		{
			let newId = parseInt(id, 10);

			return this.userchannelService.findAllChannelsByUserId(newId);
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);

			throw new InternalServerErrorException(ERROR_MESSAGES.USER_CHANNEL.FINDCHANNELFORAUSER_FAILED);
		}
	}

	/**
	 * Create a new invitation for a member in a channel
	 * 
	 * @param createUserChannelDTO DTO containing data to create the new userchannel
	 * 
	 * @returns UserChannelDTO
	 * 
	 * @throws HTTPException NOT_FOUND if the user or the channel is not found
	 * @throws HTTPException CONFLICT if the user don't belong to the channel
	 * @throws HTTPException CONFLICT if the user try to join a DM chat
	 * @throws HTTPException INTERNAL_SERVER_EXCEPTION if the creation of the channel failed
	 */
	@Post()
	async joinChannel(@Body() createUserChannelDTO : CreateUserChannelDTO): Promise<UserChannelDTO>
	{
		try
		{
			return this.userchannelService.joinChannel(createUserChannelDTO);
		}
		catch(error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);
			if (error instanceof ConflictException)
				throw new ConflictException(error.message);
			throw new InternalServerErrorException(ERROR_MESSAGES.USER_CHANNEL.JOINCHANNEL_FAILED);
		}
	}

	/**
	 * Delete a member to a userchannel by ih id
	 * 
	 * @param idUser User's id
	 * @param idChannel channel's id
	 * 
	 * @returns Message in a string
	 * 
	 * @throws HTTPException NOT_FOUND if the user or the channel is not found
	 * @throws HTTPException CONFLICT if the user don't belong to the channel
	 * @throws HTTPException FORBIDDEN if the user try to kick the owner
	 * @throws HTTPException FORBIDDEN if the user try to kick someone in DM channel
	 * @throws HTTPException INTERNAL_SERVER_EXCEPTION if the deletion of the channel failed
	 */
	@Delete('/delete/:idUser/:idChannel')
	async deleteMember(@Param('idUser') idUser: string, @Param('idChannel') idChannel: string) : Promise<String>
	{
		try
		{
			let newIdUser = parseInt(idUser, 10);
			let newIdChannel = parseInt(idChannel, 10);

			this.userchannelService.deleteMember(newIdUser, newIdChannel);
			return MESSAGES.USER_CHANNEL.DELETE_SUCCESS;

		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);
			if (error instanceof ConflictException)
				throw new ConflictException(error.message);
			throw new InternalServerErrorException(ERROR_MESSAGES.USER_CHANNEL.DELETEMEMBER_FAILED);
		}
	}

	/**
	 * Update the role of a member of a channel
	 * 
	 * @param updateRoleUserChannelDTO DTO containing data to update the role
	 * @param id User's id
	 * 
	 * @returns Updated record
	 * 
	 * @throw HTTPException with status NOT_FOUND if user is not found or the member is not found
	 * @throw HTTPException with status NOT_FOUND if channel is not found
	 * @throw HTTPException with status NOT_FOUND if user's role is not found or the new role is not found
	 * @throw HTTPException with status CONFLICT if user or member is not in the channel
	 * @throw HTTPException with status FORBIDDEN if the user is not a admin of the channel
	 * @throw HTTPException with status FORBIDDEN if trying to change the owner's role
	 * @throw HTTPException with status FORBIDDEN if trying to change a role in DM channel
	 */
	@Put('/modifyRole/:id')
	async modifyMemberRole(@Body() updateRoleUserChannelDTO : UpdateRoleUserChannelDTO, @Param('id') id : string): Promise<UserChannelDTO>
	{
		try
		{	
			const newId = parseInt(id, 10);
			return this.userchannelService.modifyMemberRole(newId, updateRoleUserChannelDTO.idMember, updateRoleUserChannelDTO.idChannel, updateRoleUserChannelDTO.idRole);
		}
		catch (error)
		{
			
			console.log("Error caught in userChannel controler")

			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);
			if (error instanceof ConflictException)
				throw new ConflictException(error.message);
			if (error instanceof ForbiddenException)
				throw new ForbiddenException(error.message);
				
			throw new InternalServerErrorException(ERROR_MESSAGES.USER_CHANNEL.MODIFYROLE_FAILED);
		}
	}

	/**
	 * Update the mute time of a member of a channel
	 * 
	 * @param muteTimeDTO DTO containing data to add mute time
	 * 
	 * @returns Updated record
	 * 
	 * @throw HTTPException with status NOT_FOUND if user is not found
	 * @throw HTTPException with status NOT_FOUND if channel is not found
	 * @throw HTTPException with status CONFLICT if user is not in the channel
	 * @throw HTTPException with status BAD_REQUEST if the time to mute equals null or is negative or equals 0
	 */
	@Put('/addMuteTime')
	async addMuteTime(@Body() muteTimeDTO: UpdateMuteTimeUserChannelDTO) : Promise<UserChannelDTO>
	{
		try
		{
			return this.userchannelService.addMuteTime(muteTimeDTO.idUser, muteTimeDTO.idChannel, muteTimeDTO.muteTime);
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);
			if (error instanceof ConflictException)
				throw new ConflictException(error.message);
			if (error instanceof BadRequestException)
				throw new ConflictException(error.message);
			throw new InternalServerErrorException(ERROR_MESSAGES.USER_CHANNEL.ADDMUTETIME_FAILED);
		}
	}
}

