import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthSocket, WSAuthMiddleware } from 'src/wsAuth.middleware';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class MessagesGateway {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  @WebSocketServer()
  server: SocketIOServer;

  afterInit(server: SocketIOServer) {
    const middle = WSAuthMiddleware(this.jwtService, this.userService);
    server.use(middle);
    console.log(`WS ${MessagesGateway.name} init`);
  }

  handleDisconnect(client: Socket) {
    console.log('client disconnect', client.id);
  }

  handleConnection(client: AuthSocket, ...args: any[]) {
    console.log('client connect', client.id, client.user);
  }

  @SubscribeMessage('createMessage')
  handleMessage(client: any, payload: any): string {
    console.log('Client: ', client);
    console.log('Payload: ', payload);
    return 'Fuck me';
  }
}
