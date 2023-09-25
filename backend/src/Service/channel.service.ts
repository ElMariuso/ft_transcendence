import { Injectable } from '@nestjs/common';
import { Channel } from '@prisma/client';
import { ChannelQuery } from 'src/Query/channel.query';
import { ChannelDTO } from 'src/DTO/channel/channel.dto';
import { CreateChannelDTO } from 'src/DTO/channel/createChannel.dto';

@Injectable()
export class ChannelService
{
	constructor(private readonly channelQuery: ChannelQuery) {}

	/**
	 * Gets all the channels
	 * 
	 * @returns All the channels
	 */
	async findAllChannels(): Promise<Channel []>
	{
		return this.channelQuery.findAllChannels();
	}

	/**
	 * Gets a channel by his id
	 * 
	 * @param id  channel's id to find
	 * 
	 * @returns ChannelDTO if the channel is find, null otherwise
	 */
	async findChannelById(id: number): Promise<ChannelDTO | null>
	{
		const channel = await this.channelQuery.findChannelById(id);

		if (!channel)
			return null;
		
		return this.transformToDTO(channel);
	}

	/**
	 * Creates a channel in DB
	 * 
	 * @param channel ChannelDTO to create
	 * 
	 * @returns New channel
	 */
	async createChannel(channel : CreateChannelDTO) : Promise<ChannelDTO>
	{
		const newChannel = await this.channelQuery.createChannel(channel);

		return this.transformToDTO(newChannel);
	}

	/**
	 * Delete a channel based on their id
	 * 
	 * @param id channel's id to delete
	 * 
	 * @returns The channel deleted if the channel was deleted successfully, null otherwise
	 */
	async deleteChannel(id: number) : Promise<Channel | null>
	{
		const deletedChannel = await this.channelQuery.findChannelById(id);

		if (!deletedChannel)
			return null;
		
		await this.channelQuery.deleteChannel(id);

		return deletedChannel;
	}

	/**
	 * Transform a Prisma channel Object to a ChannelDTO
	 * 
	 * @param channel Prisma channel Object
	 * 
	 * @returns ChannelDTO
	 */
	private transformToDTO(channel: Channel): ChannelDTO
	{
		const channelDTO: ChannelDTO =
		{
			idChannel: channel.idChannel,
			name: channel.name,
			idOwner: channel.idOwner,
			idType: channel.idType
		};

		return channelDTO;
	}
}
