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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
let UploadsService = class UploadsService {
    configService;
    configured;
    constructor(configService) {
        this.configService = configService;
        const cloudName = configService.get('cloudinary.cloudName');
        const apiKey = configService.get('cloudinary.apiKey');
        const apiSecret = configService.get('cloudinary.apiSecret');
        this.configured = Boolean(cloudName && apiKey && apiSecret);
        if (this.configured) {
            cloudinary_1.v2.config({
                cloud_name: cloudName,
                api_key: apiKey,
                api_secret: apiSecret,
            });
        }
    }
    get isConfigured() {
        return this.configured;
    }
    async uploadBuffer(buffer, folder = 'rentable/products') {
        if (!this.configured) {
            throw new Error('Cloudinary is not configured. Set CLOUDINARY_* env vars.');
        }
        return new Promise((resolve, reject) => {
            const upload = cloudinary_1.v2.uploader.upload_stream({
                folder,
                resource_type: 'image',
                quality: 'auto',
                fetch_format: 'auto',
            }, (error, result) => {
                if (error || !result)
                    return reject(error);
                resolve(result.secure_url);
            });
            stream_1.Readable.from(buffer).pipe(upload);
        });
    }
    async uploadMany(files, folder) {
        return Promise.all(files.map((f) => this.uploadBuffer(f.buffer, folder)));
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map