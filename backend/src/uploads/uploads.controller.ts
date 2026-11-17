import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { memoryStorage } from 'multer';

@ApiTags('Uploads')
@Controller('uploads')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('images')
  @ApiOperation({
    summary: 'Upload up to 5 images and get back Cloudinary URLs',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    if (!this.uploadsService.isConfigured) {
      // In development without Cloudinary, return placeholder URLs
      return {
        success: true,
        data: files.map(
          (_, i) =>
            `https://images.unsplash.com/photo-${1600000000000 + i}?auto=format&fit=crop&w=800&q=80`,
        ),
        warning: 'Cloudinary not configured — placeholder URLs returned',
      };
    }

    const urls = await this.uploadsService.uploadMany(files);
    return { success: true, data: urls };
  }
}
