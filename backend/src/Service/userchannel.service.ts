import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { User_Channel } from '@prisma/client';

import { UserQuery } from 'src/Query/user.query';
import { ChannelQuery } from 'src/Query/channel.query';
import { UserChannelQuery } from 'src/Query/userchannel.query';
import { RoleQuery } from 'src/Query/role.query';

import { UserChannelDTO } from 'src/DTO/userchannel/userchannel.dto';
import { ChannelDTO } from 'src/DTO/channel/channel.dto';

@Injectable()
export class UserChannelService
{
	constructor(
		private readonly userchannelQuery: UserChannelQuery,
		private readonly userQuery: UserQuery,
		private readonly channelQuery: ChannelQuery,
		private readonly roleQuery: RoleQuery ) {}


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
			throw new NotFoundException();
		
		const channels = await this.channelQuery.findAllChannelsByUserId(idUser);

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
	async addMember(idUser: number, idChannel: number) : Promise<UserChannelDTO>
	{
		const user = await this.userQuery.findUserById(idUser);
		const channel = await this.channelQuery.findChannelById(idChannel);

		if (!user || !channel)
			throw new NotFoundException();
		
		const userChannel = await this.userchannelQuery.findUserChannelByUserAndChannelIds(idUser, idChannel);
		if (userChannel)
			throw new ConflictException();

		const newMember = await this.userchannelQuery.addMember(idUser, idChannel);

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

		if (!user || !channel)
			throw new NotFoundException();
		
		const userChannel = await this.userchannelQuery.findUserChannelByUserAndChannelIds(idUser, idChannel);
		if (!userChannel)
			throw new ConflictException();

		await this.userchannelQuery.deleteMember(userChannel.idUser_Channel);
	}

	/**
	 * Update the role of a member of a channel
	 * 
	 * @param idUserChannel UserChannel's id
	 * @param idRole Role's id
	 * 
	 * @returns Updated record
	 */
	async modifyMemberRole(idUser: number, idChannel: number, idRole: number)
	{
		const user = await this.userQuery.findUserById(idUser);
		const channel = await this.channelQuery.findChannelById(idChannel);
		const role = await this.roleQuery.findRoleById(idRole);

		if (!user || !channel || !role)
			throw new NotFoundException();

		let userChannel = await this.userchannelQuery.findUserChannelByUserAndChannelIds(idUser, idChannel);

		if (!userChannel)
			throw new ConflictException();
		
		userChannel = await this.userchannelQuery.updateRole(userChannel.idUser_Channel, idRole);
		
		return this.transformToUserChannelDTO(userChannel);
	}

	/**
	 * Update the mute time of a member of a channel
	 * 
	 * @param idUserChannel UserChannel's id
	 * @param timeToMute Time to mute a member
	 * 
	 * @returns  Updated record
	 */
	async addMuteTime(idUser: number, idChannel: number, timeToMute: number)
	{
		if (timeToMute <= 0 || !timeToMute)
			throw new BadRequestException();

		const user = await this.userQuery.findUserById(idUser);
		const channel = await this.channelQuery.findChannelById(idChannel);

		if (!user || !channel)
			throw new NotFoundException();
		
		let userChannel = await this.userchannelQuery.findUserChannelByUserAndChannelIds(idUser, idChannel);

		if (!userChannel)
			throw new NotFoundException();

		const newUsCh = await this.userchannelQuery.updateMuteTime(userChannel.idUser_Channel, timeToMute);

		return this.transformToUserChannelDTO(newUsCh);
	}

	/**
	 * Accept the invitation of a channel
	 * 
	 * @param idUserChannel UserChannel's id
	 * 
	 * @returns  Updated record
	 */
	async acceptChannel(idUser: number, idChannel: number)
	{
		const user = await this.userQuery.findUserById(idUser);
		const channel = await this.channelQuery.findChannelById(idChannel);

		if (!user || !channel)
			throw new NotFoundException();

		let userChannel = await this.userchannelQuery.findUserChannelByUserAndChannelIds(idUser, idChannel);

		if (!userChannel)
			throw new NotFoundException();

		const newUsCh = await this.userchannelQuery.acceptChannel(userChannel.idUser_Channel);

		return this.transformToUserChannelDTO(newUsCh);
	}

	/**
	 * Refuse the invitation of a channel
	 * 
	 * @param idUserChannel UserChannel's id
	 * 
	 * @returns  Updated record
	 */
	async refuseChannel(idUser: number, idChannel: number)
	{
		const user = await this.userQuery.findUserById(idUser);
		const channel = await this.channelQuery.findChannelById(idChannel);

		if (!user || !channel)
			throw new NotFoundException();

		let userChannel = await this.userchannelQuery.findUserChannelByUserAndChannelIds(idUser, idChannel);

		if (!userChannel)
			throw new NotFoundException();

		const newUsCh = await this.userchannelQuery.refuseChannel(userChannel.idUser_Channel);
		
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
			idRole: userchannel.idRole
		};

		return userchannelDTO;
	}
}
