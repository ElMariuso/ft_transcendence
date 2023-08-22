// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './Controller/auth.controller'; // Import your controller here

@Module({
  controllers: [AuthController],
})
export class AuthModule {}