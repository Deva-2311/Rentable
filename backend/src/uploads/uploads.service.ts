import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadsService {
  private readonly configured: boolean;

  constructor(private configService: ConfigService) {
    const cloudName = configService.get<string>('cloudinary.cloudName');
    const apiKey = configService.get<string>('cloudinary.apiKey');
    const apiSecret = configService.get<string>('cloudinary.apiSecret');

    this.configured = Boolean(cloudName && apiKey && apiSecret);

    if (this.configured) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
    }
  }

  get isConfigured(): boolean {
    return this.configured;
  }

  /**
   * Upload a buffer (from Multer's memoryStorage) to Cloudinary.
   * Returns a secure HTTPS URL.
   */
  async uploadBuffer(
    buffer: Buffer,
    folder: string = 'rentable/products',
  ): Promise<string> {
    if (!this.configured) {
      throw new Error(
        'Cloudinary is not configured. Set CLOUDINARY_* env vars.',
      );
    }

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) return reject(error);
          resolve(result.secure_url);
        },
      );

      Readable.from(buffer).pipe(upload);
    });
  }

  /**
   * Upload multiple files and return an array of URLs.
   */
  async uploadMany(
    files: Express.Multer.File[],
    folder?: string,
  ): Promise<string[]> {
    return Promise.all(files.map((f) => this.uploadBuffer(f.buffer, folder)));
  }
}
