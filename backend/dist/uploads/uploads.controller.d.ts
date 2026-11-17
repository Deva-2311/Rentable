import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadImages(files: Express.Multer.File[]): Promise<{
        success: boolean;
        data: string[];
        warning: string;
    } | {
        success: boolean;
        data: string[];
        warning?: undefined;
    }>;
}
