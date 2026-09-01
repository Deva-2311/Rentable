import { Controller, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user notifications' })
  async getNotifications(@Req() req: any) {
    return {
      success: true,
      data: await this.notificationsService.getMyNotifications(req.user._id),
    };
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@Req() req: any) {
    await this.notificationsService.markAllAsRead(req.user._id);
    return {
      success: true,
      message: 'All notifications marked as read',
    };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a specific notification as read' })
  async markAsRead(@Req() req: any, @Param('id') id: string) {
    return {
      success: true,
      data: await this.notificationsService.markAsRead(id, req.user._id),
    };
  }
}
