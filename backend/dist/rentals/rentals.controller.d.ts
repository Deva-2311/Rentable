import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { RentalsService } from './rentals.service';
export declare class RentalsController {
    private readonly rentalsService;
    constructor(rentalsService: RentalsService);
    getActive(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: import("./schemas/rental.schema").RentalDocument[];
    }>;
    getHistory(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: import("./schemas/rental.schema").RentalDocument[];
    }>;
    getAll(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: import("./schemas/rental.schema").RentalDocument[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("./schemas/rental.schema").RentalDocument;
    }>;
    requestReturn(req: AuthenticatedRequest, id: string): Promise<{
        success: boolean;
        data: import("./schemas/rental.schema").RentalDocument;
    }>;
    completeRental(req: AuthenticatedRequest, id: string): Promise<{
        success: boolean;
        data: import("./schemas/rental.schema").RentalDocument;
    }>;
}
