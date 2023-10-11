import { Injectable } from "@nestjs/common";
import { Achievement, PrismaClient, User_Achievement } from "@prisma/client";

@Injectable()
export class AchievementQuery
{
	constructor(
		private readonly prisma: PrismaClient,
	) {}

	/**
	 * Gets all achievements
	 * 
	 * @returns Achievement []
	 */
	async findAllAchievements(): Promise<Achievement[]>
	{
		return await this.prisma.achievement.findMany();
	}

	/**
	 * Get an achievement by his id
	 * 
	 * @param id Achievement's id
	 * 
	 * @returns Achievement found or null
	 */
	async findAchievementById(id: number): Promise<Achievement | null>
	{
		return await this.prisma.achievement.findUnique
		(
			{
				where: { idAchievement: id }
			}
		);
	}

	/**
	 * Get all achievements gained by a user
	 * 
	 * @param id  User's id
	 * 
	 * @returns All acheivements gained by the user
	 */
	async findAchievementsByUserId(id: number): Promise<Achievement[]>
	{
		const us_ac = await this.prisma.user_Achievement.findMany
		(
			{
				where: { idUser: id }
			}
		);

		const idAchievements = us_ac.map(value => value.idAchievement);

		const achievements = await this.prisma.achievement.findMany
		(
			{
				where:
				{
					idAchievement:
					{
						in: idAchievements,
					}
				}
			}
		);

		return achievements;
	}

	/**
	 * Store the new achievement for the user
	 * 
	 * @param idUser User's id
	 * @param idAchievement Achievement's id
	 * 
	 * @returns New link
	 */
	async earnAchievement(idUser: number, idAchievement: number) : Promise<User_Achievement>
	{
		return await this.prisma.user_Achievement.create
		(
			{
				data:
				{
					idUser: idUser,
					idAchievement: idAchievement
				}
			}
		);
	}

}