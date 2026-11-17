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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let HealthController = class HealthController {
    connection;
    constructor(connection) {
        this.connection = connection;
    }
    async check() {
        const dbState = [
            'disconnected',
            'connected',
            'connecting',
            'disconnecting',
        ];
        const dbStatus = dbState[this.connection.readyState] ?? 'unknown';
        const memUsage = process.memoryUsage();
        const toMB = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
        return {
            status: dbStatus === 'connected' ? 'ok' : 'degraded',
            service: 'rentable-api',
            version: process.env.npm_package_version ?? '1.0.0',
            environment: process.env.NODE_ENV ?? 'development',
            timestamp: new Date().toISOString(),
            uptime: `${Math.floor(process.uptime())}s`,
            checks: {
                database: {
                    status: dbStatus,
                    healthy: dbStatus === 'connected',
                },
                memory: {
                    heapUsed: toMB(memUsage.heapUsed),
                    heapTotal: toMB(memUsage.heapTotal),
                    rss: toMB(memUsage.rss),
                    external: toMB(memUsage.external),
                },
            },
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'API health check — includes DB connectivity and memory usage',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)('health'),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Connection])
], HealthController);
//# sourceMappingURL=health.controller.js.map