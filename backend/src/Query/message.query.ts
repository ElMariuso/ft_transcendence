import { Injectable } from '@nestjs/common';
import { PrismaClient, Message } from '@prisma/client';
import { CreateMessageDTO } from 'src/DTO/message/createMessage.dto';

@Injectable()
export class MessageQuery
{
	constructor(private readonly prisma: PrismaClient) {}

	/**
	 * Gets all the messages
	 * 
	 * @returns All messages
	 * 
	 * @query select * from message;
	 */
	async findAllMessages()
	{
		return this.prisma.message.findMany();
	}

	/**
	 * Gets a message by his id
	 * 
	 * @param idMessage Message's id to find
	 * 
	 * @returns Message if the id match, null otherwise
	 * 
	 * @query select * from message where message.idMessage = $idMessage;
	 */
	async findMessageById(idMessage: number)
	{
		return this.prisma.message.findUnique(
		{
			where: { idMessage },
		});
	}

	async findAllMessagesByChannelId(idChannel: number)
	{
		return this.prisma.message.findMany
		(
			{
				where:
				{
					idChannel,
				}
			}
		);
	}

	async findAllMessagesByUserId(idUser: number)
	{
		return this.prisma.message.findMany
		(
			{
				where:
				{
					idUser,
				}
			}
		);
	}

	/**
	 * Gets all messages from a user in a channel
	 * 
	 * @param idUser User's id
	 * @param idChannel Channel's id
	 * 
	 * @returns All messages from a user in a channel
	 * 
	 * @query select * from message where message.idUser = $idUser and message.idChannel = $idChannel;
	 */
	async findAllMessageByUserIdAndChannelId(idUser: number, idChannel: number)
	{
		return this.prisma.message.findMany
		(
			{
				where: 
				{
					idUser,
					idChannel,
				}
			}
		);
	}

	/**
	 * Posts a new message in DB
	 * 
	 * @param Message CreateMessageDTO
	 * 
	 * @returns New message
	 * 
	 * @query insert into message (content, idUser, idChannel, timestamps) values ($content, $idUser, $idChannel, timestamps);
	 */
	async createMessage(message: CreateMessageDTO) : Promise<Message>
	{
		// Deconstruction de l'objet CreateMessageDTO
		const { content, idUser, idChannel } = message;

		const timestamps = new Date();
		
		const newMessage = await this.prisma.message.create(
		{
			data: 
			{
				content,
				idUser,
				idChannel,
				timestamps
			},
		});

		return newMessage;
	}

	/**
	 * Delete a message based on his id
	 * 
	 * @param idMessage Message's id to delete
	 * 
	 * @query delete from message where message.idMessage = idMessage;
	 */
	async deleteMessage(idMessage: number)
	{
		await this.prisma.message.delete(
		{
			where : { idMessage }
		}
		);
	}
}