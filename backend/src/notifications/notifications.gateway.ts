import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private userSockets: Map<string, Set<string>> = new Map();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }

      const secret =
        this.configService.get<string>('jwt.secret') || 'super-secret';
      const payload = this.jwtService.verify(token, { secret });

      const userId = payload.sub;

      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId).add(client.id);

      // Join a room specifically for this user to allow easy targeted broadcasting
      client.join(userId);
      this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
    } catch (error) {
      this.logger.warn(`Connection rejected: ${client.id} - ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.userSockets.entries()) {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
        this.logger.log(`Client disconnected: ${client.id} (User: ${userId})`);
        break;
      }
    }
  }

  /**
   * Broadcasts an event to a specific user across all their connected devices.
   */
  notifyUser(userId: string, event: string, payload: any) {
    this.server.to(userId).emit(event, payload);
    this.logger.debug(`Emitted ${event} to user ${userId}`);
  }
}
