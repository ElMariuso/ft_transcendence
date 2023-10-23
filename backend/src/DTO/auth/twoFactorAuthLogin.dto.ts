import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class TwoFactorAuthLoginDTO
{
	@IsNotEmpty()
	@IsString()
	id: string;

	@IsBoolean()
	twoFactorAuth: boolean;
}