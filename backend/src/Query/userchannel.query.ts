import { Injectable } from '@nestjs/common';
import { PrismaClient, User_Channel, User } from '@prisma/client';
import { ROLE } from 'src/globalVariables';

@Injectable()
export class UserChannelQuery
{
	constructor(private readonly prisma: PrismaClient) {}

	/**
	 * Get the UserChannel record of a specific user's and channel's ids
	 * 
	 * @param idUser User's id
	 * @param idChannel Channel's id
	 * 
	 * @returns  UserChannel if something was found or null otherwise
	 * 
	 * @query select * from user_channel where user_channel.idUser = $idUser and user_channel.idChannel = $idChannel;
	 */
	async findUserChannelByUserAndChannelIds(idUser: number, idChannel: number) : Promise<User_Channel | null>
	{
		const userchannel = await this.prisma.user_Channel.findFirst
		(
			{
				where: { idUser, idChannel },
			}
		);

		return userchannel;
	}

	/**
     * Gets all the common channels with specific type between two users 
     * 
     * @param idUser First user's id
     * @param idUser2 Second user's id
     * @param idType Channel type's id 
     * 
     * @returns List of common channels, or null
     */
    async findUserChannelByUserIds(idUser: number, idUser2: number, idType: number)
    {
        const userchannel = await this.prisma.user_Channel.findMany
        (
            {
                where:
                {
                    idUser
                },
                include:
                {
                    Channel:
                    {
                        select:
                        {
                            idType: true
                        }
                    }
                }
            }
        );

        const userchannel2 = await this.prisma.user_Channel.findMany
        (
            {
                where:
                {
                    idUser: idUser2,
                    Channel:
                    {
                        idType
                    }
                },
                include:
                {
                    Channel:
                    {
                        select:
                        {
                            idType: true
                        }
                    }
                }
            }
        );

        const common = userchannel.filter
        (
            (uc) => userchannel2.some
            (
                (uc2) => uc.idChannel === uc2.idChannel
            ) 
        );
        
        if (common.length > 0)
            return common;

        return null;    
    }

	/**
	 * Get all User for a specific channel
	 * 
	 * @param idChannel Channel's id
	 * 
	 * @returns User[]
	 */
	async findAllUsersByChannelId(idChannel: number) : Promise<User[]>
    {
        const us_ch = await this.prisma.user_Channel.findMany
        (
            {
                where:
                {
                    idChannel: idChannel
                }
            }
        );

        const idUsers = us_ch.map(value => value.idUser);

        const users = this.prisma.user.findMany
        (
            {
                where:
                {
                    idUser:
                    {
                        in: idUsers
                    }
                }
            }
        );

        const idRoles = us_ch.reduce((acc, value) =>
        {
            acc[value.idUser] = value.idRole;
            return acc;
        }, {});

        const admin = await this.prisma.role.findFirst
        (
            {
                where:
                {
                    name: ROLE.ADMIN
                }
            }
        );
        const member = await this.prisma.role.findFirst
        (
            {
                where:
                {
                    name: ROLE.MEMBER
                }
            }
        );

        const idAdmin = admin.idRole;
        const idMember = member.idRole;

        const fullUsers = (await users).map(user => 
            (
                {
                    ...user,
                    role: idRoles[user.idUser] === idAdmin ? ROLE.ADMIN : idRoles[user.idUser] === idMember ? ROLE.MEMBER : ROLE.BANNED,
                }
            ));

        return fullUsers;;
    }

	/**
	 * Invites a new member into the channel with a member role, a waiting status and a null mutetime.
	 * 
	 * @param idUser User's id
	 * @param idChannel Channel's id
	 * 
	 * @returns New record
	 * 
	 * @query insert into user_channel (idUser, idChannel, idRole, idStatus, muteTime) values ($idUser, $idChannel, 2, 2, null);
	 */
	async addMember(idUser: number, idChannel: number)
	{
		const userchannel = await this.prisma.user_Channel.create
		(
			{
				data:
				{
					idUser,
					idChannel,
					idRole: 2,
					muteTime: null
				},
			}
		);

		return userchannel;
	}

	/**
	 * Delete a member to a userchannel
	 * 
	 * @param idUserChannel UserChannel's id
	 * 
	 * @query delete from user_channel where user_channel.idUser_Channel = $idUserChannel;
	 */
	async deleteMember(idUserChannel: number)
	{
		await this.prisma.user_Channel.delete
		(
			{
				where: { idUser_Channel: idUserChannel }

			}
		);
	}

	/**
	 * Update the role of a member of a channel
	 * 
	 * @param idUserChannel UserChannel's id
	 * @param idRole Role's id
	 * 
	 * @returns Updated record
	 * 
	 * @query update user_channel set user_channel.idRole = $idRole where user_channel.idUser_Channel = $idUserChannel;
	 */
	async updateRole(idUserChannel: number, idRole: number)
	{
		const userchannel = await this.prisma.user_Channel.update
		(
			{
				where: { idUser_Channel: idUserChannel },

				data:
				{
					idRole: idRole
				},
			}
		);

		return userchannel;
	}

	/**
     * Update the mute time of a member of a channel. Mute time can be null.
     * 
     * @param idUserChannel UserChannel's id
     * @param timeToMute Time to mute a member, can be null
     * 
     * @returns  Updated record
     * 
     * @query update user_channel set user_channel.muteTime = new_date/null where user_channel.idUser_Channel = $idUserChannel;
     */
    async updateMuteTime(idUserChannel: number, timeToMute: number | null)
    {
        // Convert seconds to milliseconds -> * 1000
        const newMuteTime = timeToMute ? new Date(new Date().getTime() + timeToMute * 1000) : null;

        const userchannel = await this.prisma.user_Channel.update
        (
            {
                where: { idUser_Channel: idUserChannel },

                data:
                {
                    muteTime: newMuteTime,
                },
            }
        );

        return userchannel;
    }
}
