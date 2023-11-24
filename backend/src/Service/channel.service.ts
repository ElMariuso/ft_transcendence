import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { Channel, Message, User } from '@prisma/client';

import { ChannelQuery } from 'src/Query/channel.query';
import { ChannelTypeQuery } from 'src/Query/type.query';
import { UserQuery } from 'src/Query/user.query';
import { MessageQuery } from 'src/Query/message.query';

import { ChannelDTO } from 'src/DTO/channel/channel.dto';
import { CreateChannelDTO } from 'src/DTO/channel/createChannel.dto';
import { CreateDMChannelDTO } from 'src/DTO/channel/createDMChannel.dto';
import { UpdateChannelDTO } from 'src/DTO/channel/updateChannel.dto';

import { ERROR_MESSAGES, TYPE, ROLE } from 'src/globalVariables';

import { MessageDTO } from 'src/DTO/message/message.dto';
import { UserChannelQuery } from 'src/Query/userchannel.query';
import { UserInChannelDTO } from 'src/DTO/user/userInChannel.dto';
import { RoleQuery } from 'src/Query/role.query';
import { BlockedQuery } from 'src/Query/blocked.query';

@Injectable()
export class ChannelService
{
	constructor(
		private readonly channelQuery: ChannelQuery,
		private readonly typeQuery: ChannelTypeQuery,
		private readonly userQuery: UserQuery,
		private readonly messageQuery: MessageQuery,
		private readonly userChannelQuery: UserChannelQuery,
		private readonly roleQuery: RoleQuery,
		private readonly blockedQuery: BlockedQuery
		) {}

	/**
	 * Gets all the channels
	 * 
	 * @returns All the channels
	 */
	async findAllChannels(): Promise<Channel []>
	{
		return this.channelQuery.findAllChannels();
	}

	/**
	 * Gets a channel by his id
	 * 
	 * @param id  channel's id to find
	 * 
	 * @returns ChannelDTO if the channel is find, null otherwise
	 */
	async findChannelById(id: number): Promise<ChannelDTO | null>
	{
		const channel = await this.channelQuery.findChannelById(id);

		if (!channel)
			return null;
		
		return this.transformToDTO(channel);
	}

	/**
	 * Gets all messages in a channel from a specific channel id
	 * 
	 * @param id channel's id to find
	 * 
	 * @returns List of messages
	 */
	async findAllMessageByChannelId(id: number) : Promise<MessageDTO[]>
	{
		const channel = await this.channelQuery.findChannelById(id);

		if (!channel)
			throw new NotFoundException(ERROR_MESSAGES.CHANNEL.NOT_FOUND);

		const messages = await this.messageQuery.findAllMessagesByChannelId(id);

		if (!messages)
			return [];
		
		const allUsers = await this.userQuery.findAllUsers();

		const users = {};

		allUsers.forEach((user) =>
		{
			users[user.idUser] = user.username;
		});
		
		const messagesDTO: MessageDTO[] = messages.map((message) =>
		{
			return this.transformToMessageDTO(message, users[message.idUser]);
		});

		return messagesDTO;
	}

	/**
	 * Gets all users in a channel from a specific channel id
	 * 
	 * @param id channel's id to find
	 * 
	 * @returns List of users
	 */
	async findAllUsersByChannelId(id: number) : Promise<UserInChannelDTO[]>
	{
		const channel = await this.channelQuery.findChannelById(id);

		if (!channel)
			throw new NotFoundException(ERROR_MESSAGES.CHANNEL.NOT_FOUND);

		const users = await this.userChannelQuery.findAllUsersByChannelId(id);

		if (!users)
			return [];

		console.log(users)

		const usersDTO: UserInChannelDTO[] = users.map((user) =>
		{
			return this.transformToUserInChannelDTO(user, channel.idOwner === user.idUser ? true : false);
		});

		console.log(usersDTO)
		return usersDTO;
	}

	/**
     * Creates a channel in DB
     * 
     * @param channel ChannelDTO to create
     * 
     * @returns New channel
     */
    async createChannel(channel : CreateChannelDTO) : Promise<ChannelDTO>
    {
        const user = await this.userQuery.findUserById(channel.idOwner);
        if (!user)
            throw new BadRequestException(ERROR_MESSAGES.USER.NOT_FOUND);
            
        const type = await this.typeQuery.findChannelTypeById(channel.idType);
        if (!type)
            throw new BadRequestException(ERROR_MESSAGES.CHANNELTYPE.NOT_FOUND);
        
        if (type.name === TYPE.DM)
            throw new BadRequestException(ERROR_MESSAGES.CHANNEL.CANNOT_CREATE_DM);

        if(type.name === TYPE.PRIVATE && !channel.password)
            throw new BadRequestException(ERROR_MESSAGES.CHANNEL.PASSWORD_MISSING);
        
        if((type.name === TYPE.PUBLIC) && !channel.password)
            channel.password = "";
        
        const newChannel = await this.channelQuery.createChannel(channel);

        return this.transformToDTO(newChannel);
    }

	/**
     * Creates a DM channel in DB and associate the two users
     * 
     * @param dm Data - idUser and idUser2
     * 
     * @returns New Channel
     */
    async createDM(dm: CreateDMChannelDTO) : Promise<ChannelDTO>
    {
        const user = await this.userQuery.findUserById(dm.idUser);
        if (!user)
            throw new BadRequestException(ERROR_MESSAGES.USER.NOT_FOUND);
        
        const user2 = await this.userQuery.findUserById(dm.idUser2);
        if (!user2)
            throw new BadRequestException(ERROR_MESSAGES.USER.NOT_FOUND);
        
        if (user.idUser === user2.idUser)
            throw new BadRequestException(ERROR_MESSAGES.CHANNEL.CANNOT_CREATE_DM_WITH_YOURSELF)

        const dmType = await this.typeQuery.findChannelTypeIdByName(TYPE.DM);
        if (!dmType)
            throw new BadRequestException(ERROR_MESSAGES.CHANNELTYPE.NOT_FOUND);
        
        const common = await this.userChannelQuery.findUserChannelByUserIds(user.idUser, user2.idUser, dmType);
        if (common)
            throw new BadRequestException(ERROR_MESSAGES.USER_CHANNEL.CHANNEL_ALREADY_EXIST);
			let isBlocked = await this.blockedQuery.getBlockedByUserIds(user.idUser, user2.idUser);
			if (isBlocked)
				throw new ForbiddenException(ERROR_MESSAGES.BLOCK.USER_BLOCKED);
	
			let isBlocked = await this.blockedQuery.getBlockedByUserIds(user2.idUser, user.idUser);
			if (isBlocked)
				throw new ForbiddenException(ERROR_MESSAGES.BLOCK.USER_BLOCKED);
	
			const name = "DM " + user.username + " | " + user2.username;
			const password = "";
			const role = await this.roleQuery.findRoleByName(ROLE.MEMBER);
	
			const newChannel = await this.channelQuery.createDM(user.idUser, user2.idUser, name, password, dmType, role.idRole);
			return this.transformToDTO(newChannel);
		}
	/**
     * Update a channel in DB.
     * Can only update the password and the channel type.
     * 
     * @param id User's id
     * @param data Data to update
     * 
     * @returns Updated Channel
     */
	 async updateChannel(id: number, data: UpdateChannelDTO) : Promise<ChannelDTO>
	 {
		 const updateChannel = await this.channelQuery.findChannelById(data.idChannel);
		 if (!updateChannel)
			 throw new BadRequestException(ERROR_MESSAGES.CHANNEL.NOT_FOUND);
		 
		 const dm = await this.typeQuery.findChannelTypeIdByName(TYPE.DM);
		 if (updateChannel.idType == dm)
			 throw new BadRequestException(ERROR_MESSAGES.CHANNEL.DM_CHANGE);
 
		 const user = await this.userQuery.findUserById(id);
		 if (!user)
			 throw new BadRequestException(ERROR_MESSAGES.USER.NOT_FOUND);
		 
		 if (user.idUser != updateChannel.idOwner)
			 throw new ForbiddenException(ERROR_MESSAGES.CHANNEL.NOT_OWNER);
		 
		 if (data.password)
		 {
			 const bcrypt = require('bcryptjs');
			 const salt = bcrypt.genSaltSync(10);
			 const hash = bcrypt.hashSync(data.password, salt);
			 data.password = hash;
		 }
 
		 if (data.idType)
		 {
			 const type = await this.typeQuery.findChannelTypeById(data.idType);
			 if (!type)
				 throw new BadRequestException(ERROR_MESSAGES.CHANNELTYPE.NOT_FOUND);
			 
			 const dm = await this.typeQuery.findChannelTypeIdByName(TYPE.DM);
			 if (!dm || data.idType == dm)
				 throw new BadRequestException(ERROR_MESSAGES.CHANNEL.DM_CHANGE_INTO)
		 }
 
		 await this.channelQuery.updateChannel(data);
 
		 const updatedChannel = await this.channelQuery.findChannelById(updateChannel.idChannel);
		 return this.transformToDTO(updatedChannel);
	 }

	/**
	 * Delete a channel based on their id
	 * 
	 * @param id channel's id to delete
	 * 
	 * @returns The channel deleted if the channel was deleted successfully, null otherwise
	 */
	async deleteChannel(id: number)
	{
		const deletedChannel = await this.channelQuery.findChannelById(id);

		if (!deletedChannel)
			throw new NotFoundException(ERROR_MESSAGES.CHANNEL.NOT_FOUND);
		
		await this.channelQuery.deleteChannel(id);
	}

	/**
	 * Transform a Prisma channel Object to a ChannelDTO
	 * 
	 * @param channel Prisma channel Object
	 * 
	 * @returns ChannelDTO
	 */
	private transformToDTO(channel: Channel): ChannelDTO
	{
		const channelDTO: ChannelDTO =
		{
			idChannel: channel.idChannel,
			name: channel.name,
			idOwner: channel.idOwner,
			idType: channel.idType
		};

		return channelDTO;
	}

	private transformToMessageDTO(message: Message, username: string) : MessageDTO
	{
		const messageDTO: MessageDTO =
		{
			idMessage: message.idMessage,
			idUser: message.idUser,
			idChannel: message.idChannel,
			username: username,
			content: message.content,
			timestamps: message.timestamps,
		};

		return messageDTO;
	}

	private transformToUserInChannelDTO(user: any, owner: boolean) : UserInChannelDTO
	{
		const dto: UserInChannelDTO = 
		{
			idUser: user.idUser,
			username: user.username,
			email: user.email,
			owner: owner,
			role: user.role,
		}
		return dto;
	}
}
