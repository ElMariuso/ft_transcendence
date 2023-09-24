import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';

@WebSocketGateway({
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    allowedHeaders: ["header-test"],
    credentials: true
  }
})
export class WebSocketsGateway {
  @WebSocketServer() server;

  @SubscribeMessage('events')
  handleEvent(client: any, data: any): WsResponse<any> {
    return { event: 'events', data: 'Test' };
  }
}
