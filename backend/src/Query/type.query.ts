import { Injectable } from '@nestjs/common';
import { PrismaClient, ChannelType } from '@prisma/client';

@Injectable()
export class ChannelTypeQuery
{
	constructor(private readonly prisma: PrismaClient) {}

	/**
	 * Get a channel type by his id
	 * 
	 * @param idChannelType Channel type's id
	 * 
	 * @query select * from channeltype where channeltype.idChannelType = $idChannelType;
	 */
	async findChannelTypeById(idChannelType: number) : Promise<ChannelType | null>
	{
		const type = await this.prisma.channelType.findUnique
		(
			{
				where: { idChannelType },
			}
		);
		
		return type;
	}

	/**
	 * Get a channel type by his name 
	 * 
	 * @param name Channel type's name
	 * 
	 * @returns ChannelType or null
	 * 
	 * @query select * from channeltype where channeltype.name = $name;
	 */
	async findChannelTypeIdByName(name: string) : Promise<number>
	{
		const type = await this.prisma.channelType.findFirst
		(
			{
				where: { name },
			}
		);

		return type.idChannelType;
	}
}
