import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(req: any): Promise<{
        success: boolean;
        data: import("./schemas/notification.schema").NotificationDocument[];
    }>;
    markAllAsRead(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    markAsRead(req: any, id: string): Promise<{
        success: boolean;
        data: import("./schemas/notification.schema").NotificationDocument;
    }>;
}
