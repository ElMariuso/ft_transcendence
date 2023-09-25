import {	Controller, Body, Param, 
			Get, Post, Put, Delete, 
			InternalServerErrorException, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';

import { UserChannelService } from 'src/Service/userchannel.service';

import { ChannelDTO } from 'src/DTO/channel/channel.dto';
import { UserChannelDTO } from 'src/DTO/userchannel/userchannel.dto';
import { CreateUserChannelDTO } from 'src/DTO/userchannel/createUserChannel.dto';
import { UpdateRoleUserChannelDTO } from 'src/DTO/userchannel/updateRoleUserChannel.dto';
import { UpdateMuteTimeUserChannelDTO } from 'src/DTO/userchannel/updateMuteTimeUserChannel.dto';

@Controller('userchannels')
export class ChannelController
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
				throw new NotFoundException('User not found');

			throw new InternalServerErrorException("Can't get the channels for this user");
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
	 * @throws HTTPException INTERNAL_SERVER_EXCEPTION if the creation of the channel failed
	 */
	@Post()
	async addMember(@Body() createUserChannelDTO : CreateUserChannelDTO): Promise<UserChannelDTO>
	{
		try
		{
			return this.userchannelService.addMember(createUserChannelDTO.idUser, createUserChannelDTO.idChannel);
		}
		catch(error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException("User or channel not found");
			if (error instanceof ConflictException)
				throw new ConflictException("User not member of the channel");
			throw new InternalServerErrorException('channel creation failed');
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

			return "userchannel deleted successfully";
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException("User or channel not found");
			if (error instanceof ConflictException)
				throw new ConflictException("User not member of the channel");
			throw new InternalServerErrorException('userchannel deletion failed');
		}
	}

	@Put('/modifyRole')
	async modifyMemberRole(@Body() updateRoleUserChannelDTO : UpdateRoleUserChannelDTO): Promise<UserChannelDTO>
	{
		try
		{
			return this.userchannelService.modifyMemberRole(updateRoleUserChannelDTO.idUser, updateRoleUserChannelDTO.idChannel, updateRoleUserChannelDTO.idRole);
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException("User or channel not found");
			if (error instanceof ConflictException)
				throw new ConflictException("User not member of the channel");
			throw new InternalServerErrorException('userchannel deletion failed');
		}
	}

	@Put('/acceptChannel')
	async acceptChannel(@Body() userchannel: CreateUserChannelDTO) : Promise<UserChannelDTO>
	{
		try
		{
			return this.userchannelService.acceptChannel(userchannel.idUser, userchannel.idChannel);
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException("User or channel not found");
			if (error instanceof ConflictException)
				throw new ConflictException("User not member of the channel");
			throw new InternalServerErrorException('userchannel deletion failed');
		}
	}

	@Put('/refuseChannel')
	async refuseChannel(@Body() userchannel: CreateUserChannelDTO) : Promise<UserChannelDTO>
	{
		try
		{
			return this.userchannelService.refuseChannel(userchannel.idUser, userchannel.idChannel);
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException("User or channel not found");
			if (error instanceof ConflictException)
				throw new ConflictException("User not member of the channel");
			throw new InternalServerErrorException('userchannel deletion failed');
		}
	}

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
				throw new NotFoundException("User or channel not found");
			if (error instanceof ConflictException)
				throw new ConflictException("User not member of the channel");
			if (error instanceof BadRequestException)
				throw new ConflictException("Time needs to be positive");
			throw new InternalServerErrorException('userchannel deletion failed');
		}
	}
}

