import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Message } from '@prisma/client';

import { MessageQuery } from 'src/Query/message.query';
import { UserQuery } from 'src/Query/user.query';
import { ChannelQuery } from 'src/Query/channel.query';
import { UserChannelQuery } from 'src/Query/userchannel.query';

import { MessageDTO } from 'src/DTO/message/message.dto';
import { CreateMessageDTO } from 'src/DTO/message/createMessage.dto';

@Injectable()
export class MessageService
{
	constructor(
		private readonly messageQuery: MessageQuery,
		private readonly userQuery: UserQuery,
		private readonly channelQuery: ChannelQuery,
		private readonly userchannelQuery: UserChannelQuery,
		) {}

	/**
	 * Gets all the messages
	 * 
	 * @returns All the messages
	 */
	async findAllMessages(): Promise<Message []>
	{
		return this.messageQuery.findAllMessages();
	}

	/**
	 * Gets a message by his id
	 * 
	 * @param id  Message's id to find
	 * 
	 * @returns MessageDTO if the message is find, null otherwise
	 */
	async findMessageById(id: number): Promise<MessageDTO | null>
	{
		const message = await this.messageQuery.findMessageById(id);

		if (!message)
			throw new NotFoundException();
		
		return this.transformToDTO(message);
	}

	/**
	 * Gets all messages from a user in a channel
	 * 
	 * @param idUser User's id
	 * @param idChannel Channel's id
	 * 
	 * @returns All messages from a user in a channel
	 */
	async findAllMessageByUserIdAndChannelId(idUser: number, idChannel: number) : Promise<MessageDTO[]>
	{
		const user = await this.userQuery.findUserById(idUser);
		const channel = await this.channelQuery.findChannelById(idChannel);

		if (!user || !channel)
			throw new NotFoundException();

		const check = await this.userchannelQuery.findUserChannelByUserAndChannelIds(idUser, idChannel);
		if (!check)
			throw new BadRequestException();

		const messages = await this.messageQuery.findAllMessageByUserIdAndChannelId(idUser, idChannel);

		const formatMessages: MessageDTO[] = messages.map((message) =>
		{
			const {  idMessage, content, timestamps } = message;

			return {
				idMessage,
				content,
				timestamps
			};
		});

		return formatMessages;
	}

	/**
	 * Creates a message in DB
	 * 
	 * @param Message MessageDTO to create
	 * 
	 * @returns New message
	 */
	async createMessage(message : CreateMessageDTO) : Promise<MessageDTO>
	{
		const newMessage = await this.messageQuery.createMessage(message);

		return this.transformToDTO(newMessage);
	}

	/**
	 * Delete a message based on their id
	 * 
	 * @param id Message's id to delete
	 * 
	 * @returns The message deleted if the message was deleted successfully, null otherwise
	 */
	async deleteMessage(id: number) : Promise<Message | null>
	{
		const deletedMessage = await this.messageQuery.findMessageById(id);

		if (!deletedMessage)
			throw new NotFoundException();
		
		await this.messageQuery.deleteMessage(id);

		return deletedMessage;
	}

	/**
	 * Transform a Prisma Message Object to a MessageDTO
	 * 
	 * @param Message Prisma Message Object
	 * 
	 * @returns MessageDTO
	 */
	private transformToDTO(message: Message): MessageDTO
	{
		const messageDTO: MessageDTO =
		{
			idMessage: message.idMessage,
			content: message.content,
			timestamps: message.timestamps,
		};

		return messageDTO;
	}
}
