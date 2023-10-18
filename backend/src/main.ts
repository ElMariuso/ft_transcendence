import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors({
    origin: 'http://localhost:8080'
  });

  const prisma = new PrismaClient();

  app.use((req, res, next) => {
    req['prisma'] = prisma;
    next();
  });

  app.useWebSocketAdapter(new WsAdapter(app));
  
  await app.listen(3000);
}
bootstrap();
