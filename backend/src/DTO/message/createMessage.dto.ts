import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

/**
 * DTO used for creating a new message
 */
export class CreateMessageDTO
{
	@IsNotEmpty()
	content: string;

	@IsNumber()
	@IsPositive()
	idUser: number;

	@IsNumber()
	@IsPositive()
	idChannel: number;
}