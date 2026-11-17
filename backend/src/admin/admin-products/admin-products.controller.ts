import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AdminProductsService } from './admin-products.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from '../../common/enums/permission.enum';

@Controller('admin/products')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AdminProductsController {
  constructor(private readonly productsService: AdminProductsService) {}

  @Get('pending')
  @Permissions(Permission.PRODUCTS_READ)
  async getPendingProducts() {
    const products = await this.productsService.getPendingProducts();
    return { success: true, data: products };
  }

  @Patch(':id/approve')
  @Permissions(Permission.PRODUCTS_APPROVE)
  async approveProduct(@Param('id') id: string, @Request() req: any) {
    const adminId = String(req.user._id || req.user.id);
    const product = await this.productsService.approveProduct(
      id,
      adminId,
      req.user.role,
    );
    return {
      success: true,
      message: 'Product approved successfully',
      data: product,
    };
  }

  @Patch(':id/reject')
  @Permissions(Permission.PRODUCTS_REJECT)
  async rejectProduct(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Request() req: any,
  ) {
    const adminId = String(req.user._id || req.user.id);
    const product = await this.productsService.rejectProduct(
      id,
      reason,
      adminId,
      req.user.role,
    );
    return { success: true, message: 'Product rejected', data: product };
  }
}
