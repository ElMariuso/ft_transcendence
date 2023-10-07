import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:8080'
  });

  const prisma = new PrismaClient();

  app.use((req, res, next) => {
    req['prisma'] = prisma;
    next();
  });
  
  await app.listen(3000);
}
bootstrap();
