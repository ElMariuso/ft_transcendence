import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prisma = new PrismaClient();

  app.use((req, res, next) => {
    req['prisma'] = prisma;
    next();
  });
  
  await app.listen(3000);
}
bootstrap();
