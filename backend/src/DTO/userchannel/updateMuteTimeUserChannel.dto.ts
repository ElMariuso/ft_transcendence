import { IsInt, IsPositive } from 'class-validator';

/**
 * DTO used for update the mute time of a member of a channel
 */
export class UpdateMuteTimeUserChannelDTO
{
	@IsInt()
	@IsPositive()
	idUser: number;

	@IsInt()
	@IsPositive()
	idChannel: number;

	@IsInt()
	@IsPositive()
	muteTime: number;

}