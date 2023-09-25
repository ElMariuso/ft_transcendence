import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post } from '@nestjs/common';

import { ChannelService } from 'src/Service/channel.service';

import { ChannelDTO } from 'src/DTO/channel/channel.dto';
import { CreateChannelDTO } from 'src/DTO/channel/createChannel.dto';

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
	 * Create a new channel in database
	 * 
	 * @param createchannelDTO DTO containing data to create the new channel
	 * 
	 * @returns channelDTO
	 * @throws HTTPException with status BAD_REQUEST if the channelname already exists
	 * @Throws HTTPException INTERNAL_SERVER_EXCEPTION if the creation of the channel failed
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
			throw new InternalServerErrorException('channel creation failed');
		}
	}

	/**
	 * Delete a channel by his id
	 * 
	 * @param id channel's id to delete
	 * 
	 * @returns Message in a string
	 * @throws HTTPException with status NOT_FOUND if the channel is not found
	 */
	@Delete('/delete/:id')
	async deleteChannelById(@Param('id') id: string) : Promise<String>
	{
		let newId = parseInt(id, 10);

		const deletedchannel = this.channelService.deleteChannel(newId);

		if (!deletedchannel)
			throw new NotFoundException("channel not found");
		
		return "channel deleted successfully";
	}
}

