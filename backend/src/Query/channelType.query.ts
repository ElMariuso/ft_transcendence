import { Injectable } from '@nestjs/common';
import { PrismaClient, Channel } from '@prisma/client';
import { CreateChannelDTO } from 'src/DTO/channel/createChannel.dto';

@Injectable()
export class ChannelQuery
{
	constructor(private readonly prisma: PrismaClient) {}
	
	/**
	 * Gets a Channel by his id
	 * 
	 * @param idChannel Channel's id to find
	 * 
	 * @returns Channel if the id match, null otherwise
	 * 
	 * @query select * from channel where channel.idChannel = $idChannel;
	 */
	async findChannelById(idChannel: number) : Promise<Channel | null>
	{
		return this.prisma.channel.findUnique(
		{
			where: { idChannel },
		});
	}

	/**
	 * Gets all channel for a specific user's id
	 * 
	 * @param idUser  User's id
	 * 
	 * @returns All Channels for this specific user's id
	 * 
	 * @query select * from channel inner join user_channel on user_channel.idUser = $idUser where user_channel.idUser = $idUser;
	 */
	async findAllChannelsByUserId(idUser: number) //: Promise<Channel[]>
	{
		const us_ch = await this.prisma.user_Channel.findMany
		(
			{
				where: { idUser }
			}
		);
		
		const idChannels = us_ch.map(value => value.idChannel);

		const channels = this.prisma.channel.findMany
		(
			{
				where:
				{
					idChannel:
					{
						in: idChannels,
					}
				}
			}
		);
		
		return channels;
	}

	/**
	 * Posts a new Channel in DB
	 * 
	 * @param Channel CreateChannelDTO
	 * 
	 * @returns New Channel
	 * 
	 * @query insert into channel (name, password, idOwner, idType) values ($name, $password, $idOwner, $idType);
	 * @second_query insert into user_channel (idUser, idChannel, idRole, idStatus, muteTime) values ($idUser, newly idChannel created, 1, 2, null);
	 */
	async createChannel(Channel: CreateChannelDTO) : Promise<Channel>
	{
		// Deconstruction de l'objet CreateChannelDTO
		const { name, password, idOwner, idType } = Channel;

		const newChannel = await this.prisma.channel.create(
		{
			include:
			{
				User_Channel: true
			},
			data: 
			{
				name,
				password,
				idOwner,
				idType,
				User_Channel:
				{
					create:
					{
						idUser: idOwner,
						idRole: 1,
						muteTime: null
					}
				}
			},
			
		});

		return newChannel;
	}

	/**
	 * Delete a Channel based on his id
	 * 
	 * @param idChannel Channel's id to delete
	 * 
	 * @query delete from channel where channel.idChannel = $idChannel;
	 * @second_query delete from user_channel where user_channel.idChannel = $idChannel;
	 */
	async deleteChannel(idChannel: number)
	{
		await this.prisma.user_Channel.deleteMany
		(
			{
				where: { idChannel }
			}
		);
		
		await this.prisma.channel.delete
		(
			{
				where : { idChannel }
			}
		);
	}
}
