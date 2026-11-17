import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: import("./schemas/notification.schema").NotificationDocument[];
    }>;
    markAllAsRead(req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
    }>;
    markAsRead(req: AuthenticatedRequest, id: string): Promise<{
        success: boolean;
        data: import("./schemas/notification.schema").NotificationDocument;
    }>;
}
