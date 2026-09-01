import { RentalsService } from './rentals.service';
export declare class RentalsController {
    private readonly rentalsService;
    constructor(rentalsService: RentalsService);
    getActive(req: any): Promise<{
        success: boolean;
        data: import("./schemas/rental.schema").RentalDocument[];
    }>;
    getHistory(req: any): Promise<{
        success: boolean;
        data: import("./schemas/rental.schema").RentalDocument[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("./schemas/rental.schema").RentalDocument;
    }>;
    requestReturn(req: any, id: string): Promise<{
        success: boolean;
        data: import("./schemas/rental.schema").RentalDocument;
    }>;
    completeRental(req: any, id: string): Promise<{
        success: boolean;
        data: import("./schemas/rental.schema").RentalDocument;
    }>;
}
