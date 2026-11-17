"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const crypto = __importStar(require("crypto"));
if (typeof globalThis.crypto === 'undefined') {
    globalThis.crypto = {
        getRandomValues: crypto.webcrypto?.getRandomValues.bind(crypto.webcrypto),
        randomUUID: crypto.randomUUID.bind(crypto)
    };
}
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const helmet_1 = __importDefault(require("helmet"));
const swagger_1 = require("@nestjs/swagger");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const nest_winston_1 = require("nest-winston");
const winston = __importStar(require("winston"));
const winstonLogger = nest_winston_1.WinstonModule.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.colorize(), winston.format.printf(({ timestamp, level, message, context }) => `${timestamp} [${context ?? 'App'}] ${level}: ${message}`)),
        }),
    ],
});
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { logger: winstonLogger });
    const logger = new common_1.Logger('Bootstrap');
    app.enableShutdownHooks();
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: [
            process.env.FRONTEND_URL,
            'http://localhost:3000',
            'http://localhost:3030',
        ].filter(Boolean),
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('RENTABLE API')
        .setDescription('The RENTABLE Premium Product Rental Marketplace API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 5000;
    await app.listen(port);
    logger.log(`🚀 Rentable API running on: ${await app.getUrl()}`);
    logger.log(`📚 Swagger docs: ${await app.getUrl()}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map