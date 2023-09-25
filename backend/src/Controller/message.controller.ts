import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post } from '@nestjs/common';
import { MessageService } from 'src/Service/message.service';
import { MessageDTO } from 'src/DTO/message/message.dto';
import { CreateMessageDTO } from 'src/DTO/message/createMessage.dto';

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
	 * @Throws HTTPException INTERNAL_SERVER_EXCEPTION if the creation of the message failed
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
			throw new InternalServerErrorException('Message creation failed');
		}
	}

	/**
	 * Delete a message by his id
	 * 
	 * @param id Message's id to delete
	 * 
	 * @returns Message in a string
	 * @throws HTTPException with status NOT_FOUND if the message is not found
	 */
	@Delete('/delete/:id')
	async deleteMessageById(@Param('id') id: string) : Promise<String>
	{
		let newId = parseInt(id, 10);
		
		const deletedMessage = this.messageService.deleteMessage(newId);

		if (!deletedMessage)
			throw new NotFoundException("Message not found");
		
		return "Message deleted successfully";
	}

}

