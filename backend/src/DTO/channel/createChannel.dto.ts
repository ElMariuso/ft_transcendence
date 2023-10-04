import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

/**
 * DTO used for creating a new game
 */
export class CreateChannelDTO
{
	@IsNotEmpty()
	name: string;

	password: string;

	@IsNumber()
	@IsPositive()
	idOwner: number;

	@IsNumber()
	@IsPositive()
	idType: number;
}