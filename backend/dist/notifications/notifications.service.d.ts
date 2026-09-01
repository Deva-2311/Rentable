import { Model } from 'mongoose';
import { NotificationDocument, NotificationType } from './schemas/notification.schema';
export declare class NotificationsService {
    private notificationModel;
    constructor(notificationModel: Model<NotificationDocument>);
    create(userId: string, type: NotificationType, message: string): Promise<NotificationDocument>;
    getMyNotifications(userId: string): Promise<NotificationDocument[]>;
    markAsRead(id: string, userId: string): Promise<NotificationDocument>;
    markAllAsRead(userId: string): Promise<void>;
}
