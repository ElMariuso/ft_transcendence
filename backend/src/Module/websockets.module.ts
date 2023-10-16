import { Module } from '@nestjs/common';
import { WebSocketsGateway } from 'src/Gateway/websockets.gateway';

@Module({
    providers: [WebSocketsGateway],
})
export class WebSocketsModule {}
