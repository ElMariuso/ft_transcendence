import { IsNumber, IsPositive } from 'class-validator';

/**
 * DTO used for creating a new game
 */
export class CreateGameDTO
{
	@IsNumber()
	@IsPositive()
	idPlayerOne: number;

	@IsNumber()
	@IsPositive()
	idPlayerSecond: number;

	@IsNumber()
	@IsPositive()
	idWinner: number;

	@IsNumber()
	@IsPositive()
	scoreLeft: number;

	@IsNumber()
	@IsPositive()
	scoreRight: number;
}