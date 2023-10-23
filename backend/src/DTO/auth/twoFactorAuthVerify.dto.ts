import { IsNotEmpty, IsString, IsInt, IsPositive } from 'class-validator';

export class TwoFactorAuthVerifyDTO
{
	@IsNotEmpty()
	@IsString()
	code: string;
	
	@IsNotEmpty()
	@IsInt()
	@IsPositive()
	userID: number;
}