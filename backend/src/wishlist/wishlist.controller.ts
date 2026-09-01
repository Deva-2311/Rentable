import { Controller, Get, Post, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';

@ApiTags('Wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.BORROWER)
@ApiBearerAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user wishlist' })
  async getWishlist(@Req() req: any) {
    return {
      success: true,
      data: await this.wishlistService.getWishlist(req.user._id),
    };
  }

  @Post(':productId')
  @ApiOperation({ summary: 'Add product to wishlist' })
  async addProduct(@Req() req: any, @Param('productId') productId: string) {
    return {
      success: true,
      data: await this.wishlistService.addProduct(req.user._id, productId),
    };
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove product from wishlist' })
  async removeProduct(@Req() req: any, @Param('productId') productId: string) {
    return {
      success: true,
      data: await this.wishlistService.removeProduct(req.user._id, productId),
    };
  }
}
