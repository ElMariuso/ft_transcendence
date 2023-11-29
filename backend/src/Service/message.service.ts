import { Injectable, BadRequestException } from '@nestjs/common';
import { Message } from '@prisma/client';

import { MessageQuery } from 'src/Query/message.query';
import { UserQuery } from 'src/Query/user.query';
import { ChannelQuery } from 'src/Query/channel.query';
import { UserChannelQuery } from 'src/Query/userchannel.query';

import { MessageDTO } from 'src/DTO/message/message.dto';
import { CreateMessageDTO } from 'src/DTO/message/createMessage.dto';

import { ERROR_MESSAGES } from 'src/globalVariables';
import { AchievementService } from './achievement.service';

@Injectable()
export class MessageService
{
	constructor(
		private readonly messageQuery: MessageQuery,
		private readonly userQuery: UserQuery,
		private readonly channelQuery: ChannelQuery,
		private readonly userchannelQuery: UserChannelQuery,
		private readonly achievementService: AchievementService,
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
			throw new BadRequestException(ERROR_MESSAGES.MESSAGE.NOT_FOUND);

		const user = await this.userQuery.findUserById(message.idUser);
		if (!user)
			throw new BadRequestException(ERROR_MESSAGES.USER.NOT_FOUND);

		return this.transformToDTO(message, user.username);
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

		if (!user)
			throw new BadRequestException(ERROR_MESSAGES.USER.NOT_FOUND);
		if (!channel)
			throw new BadRequestException(ERROR_MESSAGES.CHANNEL.NOT_FOUND);

		const check = await this.userchannelQuery.findUserChannelByUserAndChannelIds(idUser, idChannel);
		if (!check)
			throw new BadRequestException(ERROR_MESSAGES.USER_CHANNEL.NOT_FOUND);

		const messages = await this.messageQuery.findAllMessageByUserIdAndChannelId(idUser, idChannel);

		const formatMessages: MessageDTO[] = messages.map((message) =>
		{
			return this.transformToDTO(message, user.username);
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
        const user = await this.userQuery.findUserById(message.idUser);
        if (!user)
            throw new BadRequestException(ERROR_MESSAGES.USER.NOT_FOUND);

        const channel = await this.channelQuery.findChannelById(message.idChannel);
        if(!channel)
            throw new BadRequestException(ERROR_MESSAGES.CHANNEL.NOT_FOUND);
        
        const userchannel = await this.userchannelQuery.findUserChannelByUserAndChannelIds(user.idUser, channel.idChannel);
        if (!userchannel)
            throw new BadRequestException(ERROR_MESSAGES.USER_CHANNEL.NOT_FOUND);

        if (userchannel.muteTime != null)
        {
            if (userchannel.muteTime > new Date())
                throw new BadRequestException(ERROR_MESSAGES.USER_CHANNEL.STILL_MUTE + userchannel.muteTime.toLocaleDateString() + " " + userchannel.muteTime.toLocaleTimeString());

            const newUsCh = await this.userchannelQuery.updateMuteTime(userchannel.idUser_Channel, null);
        }
        const newMessage = await this.messageQuery.createMessage(message);

        this.achievementService.checkAchievement(message.idUser, 3);
        
        return this.transformToDTO(newMessage, user.username);
    }

	/**
	 * Delete a message based on their id
	 * 
	 * @param id Message's id to delete
	 * 
	 * @returns The message deleted if the message was deleted successfully, null otherwise
	 */
	async deleteMessage(id: number)
	{
		const deletedMessage = await this.messageQuery.findMessageById(id);

		if (!deletedMessage)
			throw new BadRequestException(ERROR_MESSAGES.MESSAGE.NOT_FOUND);
		
		await this.messageQuery.deleteMessage(id);
	}

	/**
	 * Transform a Prisma Message Object to a MessageDTO
	 * 
	 * @param Message Prisma Message Object
	 * 
	 * @returns MessageDTO
	 */
	private transformToDTO(message: Message, username: string): MessageDTO
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
