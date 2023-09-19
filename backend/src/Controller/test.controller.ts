import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  
  @Get('message')
  sendMessage(): string {
    return 'Backend message: AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH';
  }
}