import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument, NotificationType } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(userId: string, type: NotificationType, message: string): Promise<NotificationDocument> {
    const notification = new this.notificationModel({
      user: userId,
      type,
      message,
    });
    return notification.save();
  }

  async getMyNotifications(userId: string): Promise<NotificationDocument[]> {
    return this.notificationModel.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }

  async markAsRead(id: string, userId: string): Promise<NotificationDocument> {
    const notification = await this.notificationModel.findOneAndUpdate({ _id: id, user: userId }, { isRead: true }, { new: true }).exec();
    if (!notification) throw new Error('Notification not found');
    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany({ user: userId, isRead: false }, { isRead: true }).exec();
  }
}
