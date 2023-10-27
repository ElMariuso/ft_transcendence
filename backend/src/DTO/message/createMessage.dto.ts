import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

/**
 * DTO used for creating a new message
 */
export class CreateMessageDTO
{
	@IsString()
	@IsNotEmpty()
	content: string;

	@IsNumber()
	@IsPositive()
	idUser: number;

	@IsNumber()
	@IsPositive()
	idChannel: number;
}