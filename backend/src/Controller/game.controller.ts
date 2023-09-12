import { Controller, Post, Param } from '@nestjs/common';
import { GameService } from 'src/Service/game.service';

@Controller('games')
export class GameController {
    constructor(private readonly gameService: GameService) {}
    
}
