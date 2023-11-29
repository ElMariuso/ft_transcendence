import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, ForbiddenException, Put } from '@nestjs/common';


import { ChannelService } from 'src/Service/channel.service';

import { ChannelDTO } from 'src/DTO/channel/channel.dto';
import { CreateChannelDTO } from 'src/DTO/channel/createChannel.dto';
import { CreateDMChannelDTO } from 'src/DTO/channel/createDMChannel.dto';
import { UpdateChannelDTO } from 'src/DTO/channel/updateChannel.dto';

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
	 * @throw HTTPException with status BAD_REQUEST if the channel is not found
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
			if (error instanceof BadRequestException)
				throw new BadRequestException(error.message);

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
	 * @throw HTTPException with status BAD_REQUEST if the channel is not found
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
			if (error instanceof BadRequestException)
				throw new BadRequestException(error.message);

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
	 * @throw HTTPException with status BAD_REQUEST if the user is not found
	 * @throw HTTPException with status BAD_REQUEST if the channel type is not found
	 * @throw HTTPException with status BAD_REQUEST if the channel type is DM
	 * @throw HTTPException with status BAD_REQUEST if the channel type is private and the password is empty
	 * @throw HTTPException with status INTERNAL_SERVER_EXCEPTION if the creation of the channel failed
	 */
	@Post()
	async createChannel(@Body() createchannelDTO : CreateChannelDTO): Promise<ChannelDTO>
	{
		if (createchannelDTO.idType === 1) {
			const bcrypt = require('bcryptjs');
			const salt = bcrypt.genSaltSync(10);
			const hash = bcrypt.hashSync(createchannelDTO.password, salt);
			createchannelDTO.password = hash;
		}

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
     * Create a new DM channel in database and assossiate the two users
     * 
     * @param data DTO containing data to create the new DM channel
     * 
     * @returns channelDTO
     * 
     * @throw HTTPException with status BAD_REQUEST if the first user is not found
     * @throw HTTPException with status BAD_REQUEST if the second user is not found
     * @throw HTTPException with status BAD_REQUEST if the DM channel type is not found
     * @throw HTTPException with status BAD_REQUEST if a DM channel already exist between the two users
     * @throw HTTPException with status INTERNAL_SERVER_EXCEPTION if the creation of the channel failed
     */
	@Post('/createDM/')
	async creatDM(@Body() data: CreateDMChannelDTO) : Promise<ChannelDTO>
	{
		try
		{
			return this.channelService.createDM(data);
		}
		catch (error)
		{
			if (error instanceof BadRequestException)
				throw new BadRequestException(error.message);
				
			throw new InternalServerErrorException(ERROR_MESSAGES.CHANNEL.CREATEDMCHANNEL_FAILED);
		}
	} 

	/**
     * Update a channel in DB.
     * Can only update the password and the channel type.
     * 
     * @param id User's id
     * @param updateChannelDTO Updated datas
     * 
     * @returns Updated channel
     * 
     * @throw HTTPException with status BAD_REQUEST if the channel was not found
     * @throw HTTPException with status BAD_REQUEST if the user was not found
     * @throw HTTPException with status BAD_REQUEST if the type is not valid
     * @throw HTTPException with status BAD_REQUEST if the updated type is DM type
     * @throw HTTPException with status FORBIDDEN if the user is not the channel owner
     * @throw HTTPException with status INTERNAL_SERVER_EXCEPTION if the creation of the channel failed
     */
    @Put('/update/:id')
    async updateChannel(@Param('id') id: string, @Body() updateChannelDTO : UpdateChannelDTO) : Promise<ChannelDTO>
    {
        try
        {
            let newId = parseInt(id, 10);

            return this.channelService.updateChannel(newId, updateChannelDTO);
        }
        catch (error)
        {
            if (error instanceof BadRequestException)
                throw new BadRequestException(error.message);
            if (error instanceof ForbiddenException)
                throw new ForbiddenException(error.message);
            throw new InternalServerErrorException();
        }
    }

	/**
	 * Delete a channel by his id
	 * 
	 * @param id channel's id to delete
	 * 
	 * @returns Message in a string
	 * 
	 * @throw HTTPException with status BAD_REQUEST if the channel is not found
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

