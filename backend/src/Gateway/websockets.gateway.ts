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

  constructor() {
    console.log("WebSocketsGateway initialized");
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): void {
    console.log('Message reçu:', payload);
    client.emit('message_response', 'Hello world!');
  }

  @SubscribeMessage('events')
  handleEvent(client: any, data: any): WsResponse<any> {
    console.log('Événement reçu:', data);
    return { event: 'events', data: 'Test' };
  }
}
