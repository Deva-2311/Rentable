import { ConfigService } from '@nestjs/config';
export declare class UploadsService {
    private configService;
    private readonly configured;
    constructor(configService: ConfigService);
    get isConfigured(): boolean;
    uploadBuffer(buffer: Buffer, folder?: string): Promise<string>;
    uploadMany(files: Express.Multer.File[], folder?: string): Promise<string[]>;
}
