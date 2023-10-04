import { IsInt, IsPositive } from 'class-validator';

/**
 * DTO used for update the role of a member of a channel
 */
export class UpdateRoleUserChannelDTO
{
	@IsInt()
	@IsPositive()
	idUser: number;

	@IsInt()
	@IsPositive()
	idChannel: number;

	@IsInt()
	@IsPositive()
	idRole: number;

}