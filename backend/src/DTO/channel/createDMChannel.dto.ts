import { IsInt } from 'class-validator';

/**
 * DTO used for create a new DM channel
 */
export class CreateDMChannelDTO
{
    @IsInt()
    idUser:number;

    @IsInt()
    idUser2: number;
}