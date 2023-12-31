import { ConflictException, Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';

import { User_Channel } from '@prisma/client';

import { UserQuery } from 'src/Query/user.query';
import { ChannelQuery } from 'src/Query/channel.query';
import { UserChannelQuery } from 'src/Query/userchannel.query';
import { RoleQuery } from 'src/Query/role.query';

import { CreateUserChannelDTO } from 'src/DTO/userchannel/createUserChannel.dto';
import { UserChannelDTO } from 'src/DTO/userchannel/userchannel.dto';
import { ChannelDTO } from 'src/DTO/channel/channel.dto';

import { ERROR_MESSAGES, ROLE, TYPE } from 'src/globalVariables';
import { ChannelTypeQuery } from 'src/Query/type.query';


@Injectable()
export class UserChannelService
{
	constructor(
		private readonly userchannelQuery: UserChannelQuery,
		private readonly userQuery: UserQuery,
		private readonly channelQuery: ChannelQuery,
		private readonly roleQuery: RoleQuery,
		private readonly typeQuery: ChannelTypeQuery ) {}


	/**
	 * Gets all channel for a specific user'id
	 * 
	 * @param idUser User's id
	 * 
	 * @returns List of all channels of user's id
	 */
	async findAllChannelsByUserId(idUser:number) : Promise<ChannelDTO[]>
	{
		const user = await this.userQuery.findUserById(idUser);

		if (!user)
			throw new BadRequestException(ERROR_MESSAGES.USER.NOT_FOUND);
		
		const channels = await this.channelQuery.findAllChannelsByUserId(idUser);

		if (!channels)
			return [];

		const formatChannels: ChannelDTO[] = channels.map((channel) =>
		{
			const { idChannel, name, idOwner, idType } = channel;

			return {
				idChannel,
				name,
				idOwner,
				idType,
			};
		});
		return formatChannels;
	}

	/**
	 * Invites a new member into the channel
	 * 
	 * @param idUser User's id
	 * @param idChannel Channel's id
	 * 
	 * @returns New record
	 */
	async joinChannel(newUser: CreateUserChannelDTO) : Promise<UserChannelDTO>
	{
		const user = await this.userQuery.findUserById(newUser.idUser);
		const channel = await this.channelQuery.findChannelById(newUser.idChannel);

		if (!user)
			throw new BadRequestException(ERROR_MESSAGES.USER.NOT_FOUND);
		if (!channel)
			throw new BadRequestException(ERROR_MESSAGES.CHANNEL.NOT_FOUND);

		if (channel.idType === await this.typeQuery.findChannelTypeIdByName(TYPE.PRIVATE))
		{
			const bcrypt = require('bcryptjs');
			const pwIsCorrect = bcrypt.compareSync(newUser.password, channel.password);
			
			if (!pwIsCorrect)
				throw new ForbiddenException(ERROR_MESSAGES.USER_CHANNEL.WRONG_PASSWORD);
			
		}

		const userChannel = await this.userchannelQuery.findUserChannelByUserAndChannelIds(newUser.idUser, newUser.idChannel);
		if (userChannel)
			throw new ConflictException(ERROR_MESSAGES.USER_CHANNEL.ALREADY_IN);

		if (channel.idType === await this.typeQuery.findChannelTypeIdByName(TYPE.DM))
		{
			const users = await this.userchannelQuery.findAllUsersByChannelId(channel.idChannel);
			
			if (users.length == 2)
				throw new ConflictException(ERROR_MESSAGES.USER_CHANNEL.CANTREJOINDM);
		}
		const newMember = await this.userchannelQuery.addMember(newUser.idUser, newUser.idChannel);
		return this.transformToUserChannelDTO(newMember);
	}

	/**
	 * Delete a member to a userchannel
	 * 
	 * @param idUserChannel UserChannel's id
	 */
	async deleteMember(idUser: number, idChannel: number)
	{
		const user = await this.userQuery.findUserById(idUser);
		const channel = await this.channelQuery.findChannelById(idChannel);

		if (!user)
			throw new BadRequestException(ERROR_MESSAGES.USER.NOT_FOUND);
		if (!channel)
			throw new BadRequestException(ERROR_MESSAGES.CHANNEL.NOT_FOUND);
		
		if (user.idUser === channel.idOwner)
			throw new ForbiddenException(ERROR_MESSAGES.USER_CHANNEL.KICK_OWNER);

		if (channel.idType === await this.typeQuery.findChannelTypeIdByName(TYPE.DM))
			throw new ForbiddenException(ERROR_MESSAGES.USER_CHANNEL.KICK_DM);

		const userChannel = await this.userchannelQuery.findUserChannelByUserAndChannelIds(idUser, idChannel);
		if (!userChannel)
			throw new ConflictException(ERROR_MESSAGES.USER_CHANNEL.NOT_FOUND);
			
		await this.userchannelQuery.deleteMember(userChannel.idUser_Channel);
	}

	/**
	 * Update the role of a member of a channel
	 * 
	 * @param idUser User's id
	 * @param idMember Member's id
	 * @param idUserChannel UserChannel's id
	 * @param idRole Role's id
	 * 
	 * @returns Updated record
	 */
	async modifyMemberRole(idUser: number, idMember: number, idChannel: number, idRole: number)
	{
		const user = await this.userQuery.findUserById(idUser);
		const member = await this.userQuery.findUserById(idMember);

		if (!user || !member)
			throw new BadRequestException(ERROR_MESSAGES.USER.NOT_FOUND);
		
		const channel = await this.channelQuery.findChannelById(idChannel);	

		if (!channel)
			throw new BadRequestException(ERROR_MESSAGES.CHANNEL.NOT_FOUND);

		if (channel.idOwner == member.idUser)
			throw new ForbiddenException(ERROR_MESSAGES.USER_CHANNEL.CHANGE_OWNER_ROLE);
		if (channel.idType === await this.typeQuery.findChannelTypeIdByName(TYPE.DM))
			throw new ForbiddenException(ERROR_MESSAGES.USER_CHANNEL.CHANGE_DM_ROLE);

		const role = await this.roleQuery.findRoleById(idRole);
		if (!role)
			throw new BadRequestException(ERROR_MESSAGES.ROLE.NOT_FOUND);

		const checkAdmin = await this.userchannelQuery.findUserChannelByUserAndChannelIds(idUser, idChannel);
		if (!checkAdmin)
			throw new ConflictException(ERROR_MESSAGES.USER_CHANNEL.NOT_FOUND);

		const admin = await this.roleQuery.findRoleById(checkAdmin.idRole);
		if (!admin)
			throw new BadRequestException(ERROR_MESSAGES.ROLE.NOT_FOUND);

		if (admin.name != ROLE.ADMIN)
			throw new ForbiddenException(ERROR_MESSAGES.USER_CHANNEL.FORBIDDEN_ACTION);

		let userChannel = await this.userchannelQuery.findUserChannelByUserAndChannelIds(idMember, idChannel);
		if (!userChannel)
			throw new ConflictException(ERROR_MESSAGES.USER_CHANNEL.NOT_FOUND);
		
		userChannel = await this.userchannelQuery.updateRole(userChannel.idUser_Channel, idRole);

		return this.transformToUserChannelDTO(userChannel);
	}

	/**
	 * Update the mute time of a member of a channel
	 * 
	 * @param idUser User's id
	 * @param idUserChannel UserChannel's id
	 * @param timeToMute Time to mute a member
	 * 
	 * @returns  Updated record
	 */
	async addMuteTime(idUser: number, idChannel: number, timeToMute: number)
	{
		if (timeToMute <= 0 || !timeToMute)
			throw new BadRequestException(ERROR_MESSAGES.USER_CHANNEL.WRONG_MUTETIME);

		const user = await this.userQuery.findUserById(idUser);
		const channel = await this.channelQuery.findChannelById(idChannel);

		if (!user)
			throw new BadRequestException(ERROR_MESSAGES.USER.NOT_FOUND);
		if (!channel)
			throw new BadRequestException(ERROR_MESSAGES.CHANNEL.NOT_FOUND);

		
		let userChannel = await this.userchannelQuery.findUserChannelByUserAndChannelIds(idUser, idChannel);

		if (!userChannel)
			throw new ConflictException(ERROR_MESSAGES.USER_CHANNEL.NOT_FOUND);


		const newUsCh = await this.userchannelQuery.updateMuteTime(userChannel.idUser_Channel, timeToMute);

		return this.transformToUserChannelDTO(newUsCh);
	}

	/**
     * Transform a Prisma User Object to a UserChannelDTO
     * 
     * @param userchannel Prisma User_Channel Object
     * 
     * @returns UserChannelDTO
     */
    private transformToUserChannelDTO(userchannel: User_Channel) : UserChannelDTO
    {
        const userchannelDTO: UserChannelDTO = 
        {
            idUser_Channel: userchannel.idUser_Channel,
            idUser: userchannel.idUser,
            idChannel: userchannel.idChannel,
            idRole: userchannel.idRole,
            muteTime: userchannel.muteTime
        };

        return userchannelDTO;
    }
}
