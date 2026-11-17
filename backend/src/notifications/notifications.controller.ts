import { Controller, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
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
  async getNotifications(@Req() req: AuthenticatedRequest) {
    return {
      success: true,
      data: await this.notificationsService.getMyNotifications(
        String(req.user._id),
      ),
    };
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@Req() req: AuthenticatedRequest) {
    await this.notificationsService.markAllAsRead(String(req.user._id));
    return {
      success: true,
      message: 'All notifications marked as read',
    };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a specific notification as read' })
  async markAsRead(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return {
      success: true,
      data: await this.notificationsService.markAsRead(
        id,
        String(req.user._id),
      ),
    };
  }
}
