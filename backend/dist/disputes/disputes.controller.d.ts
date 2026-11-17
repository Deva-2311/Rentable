import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
export declare class DisputesController {
    private readonly disputesService;
    constructor(disputesService: DisputesService);
    create(req: AuthenticatedRequest, createDisputeDto: CreateDisputeDto): Promise<{
        success: boolean;
        message: string;
        data: import("./schemas/dispute.schema").DisputeDocument;
    }>;
    findAll(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: import("./schemas/dispute.schema").DisputeDocument[];
    }>;
    findOne(req: AuthenticatedRequest, id: string): Promise<{
        success: boolean;
        data: import("./schemas/dispute.schema").DisputeDocument;
    }>;
    resolve(req: AuthenticatedRequest, id: string, resolveDisputeDto: ResolveDisputeDto): Promise<{
        success: boolean;
        message: string;
        data: import("./schemas/dispute.schema").DisputeDocument;
    }>;
}
