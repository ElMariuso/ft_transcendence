import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { MessageService } from 'src/Service/message.service';
import { MessageDTO } from 'src/DTO/message/message.dto';
import { CreateMessageDTO } from 'src/DTO/message/createMessage.dto';

import { ERROR_MESSAGES, MESSAGES } from 'src/globalVariables';

@Controller('messages')
export class MessageController
{
	constructor(private readonly messageService: MessageService) {}

	/**
	 * Get all messages
	 * 
	 * @returns all messages
	 */
	@Get()
	async getAllMessages()
	{
		return this.messageService.findAllMessages();
	}

	/**
	 * Gets a message by his id
	 * 
	 * @param id Message's id to find
	 * 
	 * @returns MessageDTO or null
	 */
	@Get(':id')
	async findMessageById(@Param('id') id: string) : Promise<MessageDTO | null>
	{
		let newId = parseInt(id, 10);
		return this.messageService.findMessageById(newId);
	}

	/**
	 * Create a new message in database
	 * 
	 * @param createMessageDTO DTO containing data to create the new message
	 * 
	 * @returns MessageDTO
	 * 
	 * @throws HTTPException BAD_REQUEST if the user is not found
	 * @throws HTTPException BAD_REQUEST if the channel is not found
	 * @throws HTTPException BAD_REQUEST if the user is not in the channel
	 * @throws HTTPException BAD_REQUEST if the user is still in mute time
	 * @throws HTTPException INTERNAL_SERVER_EXCEPTION if the creation of the message failed
	 */
	@Post()
	async createMessage(@Body() createMessageDTO : CreateMessageDTO): Promise<MessageDTO>
	{
		try
		{
			return this.messageService.createMessage(createMessageDTO);
		}
		catch(error)
		{
			if (error instanceof BadRequestException)
				throw new BadRequestException(error.message);
				
			throw new InternalServerErrorException(ERROR_MESSAGES.MESSAGE.CREATEMESSAGE_FAILED);
		}
	}

	/**
	 * Delete a message by his id
	 * 
	 * @param id Message's id to delete
	 * 
	 * @returns Message in a string
	 * 
	 * @throws HTTPException with status BAD_REQUEST if the message is not found
	 */
	@Delete('/delete/:id')
	async deleteMessageById(@Param('id') id: string) : Promise<String>
	{
		try
		{
			let newId = parseInt(id, 10);
			
			this.messageService.deleteMessage(newId);
			
			return MESSAGES.MESSAGE.DELETE_SUCCESS;
		}
		catch (error)
		{
			if (error instanceof BadRequestException)
				throw new BadRequestException(error.message);
			throw new InternalServerErrorException(ERROR_MESSAGES.MESSAGE.DELETEMESSAGE_FAILED);
		}
	}

}

