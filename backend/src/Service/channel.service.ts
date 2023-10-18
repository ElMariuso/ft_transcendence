import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { Channel, Message } from '@prisma/client';

import { ChannelQuery } from 'src/Query/channel.query';
import { ChannelTypeQuery } from 'src/Query/type.query';
import { UserQuery } from 'src/Query/user.query';
import { MessageQuery } from 'src/Query/message.query';

import { ChannelDTO } from 'src/DTO/channel/channel.dto';
import { CreateChannelDTO } from 'src/DTO/channel/createChannel.dto';

import { ERROR_MESSAGES, TYPE } from 'src/globalVariables';

import { MessageDTO } from 'src/DTO/message/message.dto';

@Injectable()
export class ChannelService
{
	constructor(
		private readonly channelQuery: ChannelQuery,
		private readonly typeQuery: ChannelTypeQuery,
		private readonly userQuery: UserQuery,
		private readonly messageQuery: MessageQuery
		) {}

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
	 * Gets a channel by his id
	 * 
	 * @param id channel's id to find
	 * 
	 * @returns List of messages
	 */
	async findAllMessageByChannelId(id: number) : Promise<MessageDTO[]>
	{
		const channel = await this.channelQuery.findChannelById(id);

		if (!channel)
			throw new NotFoundException(ERROR_MESSAGES.CHANNEL.NOT_FOUND);

		const messages = await this.messageQuery.findAllMessagesByChannelId(id);

		if (!messages)
			return [];
		
		const allUsers = await this.userQuery.findAllUsers();

		const users = {};

		allUsers.forEach((user) =>
		{
			users[user.idUser] = user.username;
		});
		
		const messagesDTO: MessageDTO[] = messages.map((message) =>
		{
			return this.transformtoMessageDTO(message, users[message.idUser]);
		});

		return messagesDTO;
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
		const user = await this.userQuery.findUserById(channel.idOwner);
		if (!user)
			throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
			
		const type = await this.typeQuery.findChannelTypeById(channel.idType);
		if (!type)
			throw new NotFoundException(ERROR_MESSAGES.CHANNELTYPE.NOT_FOUND);
		
		if(type.name === TYPE.PRIVATE && !channel.password)
			throw new BadRequestException(ERROR_MESSAGES.CHANNEL.PASSWORD_MISSING);
		if(type.name === TYPE.PUBLIC && !channel.password)
			channel.password = "";
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
	async deleteChannel(id: number)
	{
		const deletedChannel = await this.channelQuery.findChannelById(id);

		if (!deletedChannel)
			throw new NotFoundException(ERROR_MESSAGES.CHANNEL.NOT_FOUND);
		
		await this.channelQuery.deleteChannel(id);
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

	private transformtoMessageDTO(message: Message, username: string) : MessageDTO
	{
		const messageDTO: MessageDTO =
		{
			idMessage: message.idMessage,
			idUser: message.idUser,
			idChannel: message.idChannel,
			username: username,
			content: message.content,
			timestamps: message.timestamps,
		};

		return messageDTO;
	}
}
