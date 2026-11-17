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
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const uploads_service_1 = require("./uploads.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const multer_1 = require("multer");
let UploadsController = class UploadsController {
    uploadsService;
    constructor(uploadsService) {
        this.uploadsService = uploadsService;
    }
    async uploadImages(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files uploaded');
        }
        if (!this.uploadsService.isConfigured) {
            return {
                success: true,
                data: files.map((_, i) => `https://images.unsplash.com/photo-${1600000000000 + i}?auto=format&fit=crop&w=800&q=80`),
                warning: 'Cloudinary not configured — placeholder URLs returned',
            };
        }
        const urls = await this.uploadsService.uploadMany(files);
        return { success: true, data: urls };
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)('images'),
    (0, swagger_1.ApiOperation)({
        summary: 'Upload up to 5 images and get back Cloudinary URLs',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 5, {
        storage: (0, multer_1.memoryStorage)(),
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new common_1.BadRequestException('Only image files are allowed'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadImages", null);
exports.UploadsController = UploadsController = __decorate([
    (0, swagger_1.ApiTags)('Uploads'),
    (0, common_1.Controller)('uploads'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [uploads_service_1.UploadsService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map