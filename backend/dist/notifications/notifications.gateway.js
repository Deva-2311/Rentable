"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
let NotificationsGateway = NotificationsGateway_1 = class NotificationsGateway {
    jwtService;
    configService;
    server;
    logger = new common_1.Logger(NotificationsGateway_1.name);
    userSockets = new Map();
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token ||
                client.handshake.headers.authorization?.split(' ')[1];
            if (!token) {
                client.disconnect();
                return;
            }
            const secret = this.configService.get('jwt.secret') || 'super-secret';
            const payload = this.jwtService.verify(token, { secret });
            const userId = payload.sub;
            if (!this.userSockets.has(userId)) {
                this.userSockets.set(userId, new Set());
            }
            this.userSockets.get(userId).add(client.id);
            client.join(userId);
            this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
        }
        catch (error) {
            this.logger.warn(`Connection rejected: ${client.id} - ${error.message}`);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
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
    notifyUser(userId, event, payload) {
        this.server.to(userId).emit(event, payload);
        this.logger.debug(`Emitted ${event} to user ${userId}`);
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
exports.NotificationsGateway = NotificationsGateway = NotificationsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map