import { IsInt, IsOptional, IsString } from 'class-validator';

/**
 * DTO used for updating a new channel
 */
export class UpdateChannelDTO
{
    @IsInt()
    idChannel:number;

    @IsString()
    @IsOptional()
    password: string;
    
    @IsInt()
    @IsOptional()
    idType: number;
}