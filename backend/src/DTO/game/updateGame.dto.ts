import { IsNumber, IsOptional } from 'class-validator';

/**
 * DTO used for updating a game
 */
export class UpdateGameDTO {
    @IsOptional()
    @IsNumber()
    scoreLeft?: number;

    @IsOptional()
    @IsNumber()
    scoreRight?: number;
}