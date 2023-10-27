import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post } from '@nestjs/common';


import { ChannelService } from 'src/Service/channel.service';

import { ChannelDTO } from 'src/DTO/channel/channel.dto';
import { CreateChannelDTO } from 'src/DTO/channel/createChannel.dto';

import { ERROR_MESSAGES, MESSAGES } from 'src/globalVariables';

import { MessageDTO } from 'src/DTO/message/message.dto';
import { UserInChannelDTO } from 'src/DTO/user/userInChannel.dto';

@Controller('channels')
export class ChannelController
{
	constructor(
		private readonly channelService: ChannelService) {}

	/**
	 * Get all channels
	 * 
	 * @returns all channels
	 */
	@Get()
	async getAllChannels()
	{
		return this.channelService.findAllChannels();
	}

	/**
	 * Gets a channel by his id
	 * 
	 * @param id channel's id to find
	 * 
	 * @returns channelDTO or null
	 */
	@Get(':id')
	async findChannelById(@Param('id') id: string) : Promise<ChannelDTO | null>
	{
		let newId = parseInt(id, 10);

		return this.channelService.findChannelById(newId);
	}

	/**
	 * Get all messages from a specific channel
	 *  
	 * @param id Channel's id
	 * 
	 * @returns List of messages
	 * 
	 * @throw HTTPException with status NOT_FOUND if the channel is not found
	 * @throw HTTPException with status INTERNAL_SERVER_EXCEPTION if the creation of the list failed
	 */
	@Get('/allMessages/:id')
	async getAllMessagesFromChannel(@Param('id') id:string) : Promise<MessageDTO[]>
	{
		try
		{
			let newId = parseInt(id, 10);

			return this.channelService.findAllMessageByChannelId(newId);
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);
			throw new InternalServerErrorException(ERROR_MESSAGES.CHANNEL.GETALLMESSAGESFROMCHANNEL_FAILED);
		}
	}

	/**
	 * Gets all users in a channel from a specific channel id
	 * 
	 * @param id Channel's id
	 * 
	 * @returns List of users
	 * 
	 * @throw HTTPException with status NOT_FOUND if the channel is not found
	 * @throw HTTPException with status INTERNAL_SERVER_EXCEPTION if the creation of the list failed
	 */
	@Get('/allUsers/:id')
	async getAllUsersFromChannel(@Param('id') id:string) : Promise<UserInChannelDTO[]>
	{
		try
		{
			let newId = parseInt(id, 10);

			return this.channelService.findAllUsersByChannelId(newId);
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);
			throw new InternalServerErrorException(ERROR_MESSAGES.CHANNEL.GETALLMESSAGESFROMCHANNEL_FAILED);
		}
	}

	/**
	 * Create a new channel in database
	 * 
	 * @param createchannelDTO DTO containing data to create the new channel
	 * 
	 * @returns channelDTO
	 * 
	 * @throw HTTPException with status BAD_REQUEST if the channelname already exists
	 * @throw HTTPException with status INTERNAL_SERVER_EXCEPTION if the creation of the channel failed
	 */
	@Post()
	async createChannel(@Body() createchannelDTO : CreateChannelDTO): Promise<ChannelDTO>
	{
		try
		{
			return this.channelService.createChannel(createchannelDTO);
		}
		catch(error)
		{
			if (error instanceof BadRequestException)
				throw new BadRequestException(error.message);
				
			throw new InternalServerErrorException(ERROR_MESSAGES.CHANNEL.CREATECHANNEL_FAILED);
		}
	}

	/**
	 * Delete a channel by his id
	 * 
	 * @param id channel's id to delete
	 * 
	 * @returns Message in a string
	 * 
	 * @throw HTTPException with status NOT_FOUND if the channel is not found
	 * @throw HTTPException INTERNAL_SERVER_EXCEPTION if the deletion of the channel failed
	 */
	@Delete('/delete/:id')
	async deleteChannelById(@Param('id') id: string) : Promise<String>
	{
		try
		{
			let newId = parseInt(id, 10);

			this.channelService.deleteChannel(newId);

			return MESSAGES.CHANNEL.DELETE_SUCCESS;
		}
		catch (error)
		{
			if (error instanceof NotFoundException)
				throw new NotFoundException(error.message);
			
			throw new InternalServerErrorException(ERROR_MESSAGES.CHANNEL.DELETECHANNEL_FAILED);
		}
	}
}

