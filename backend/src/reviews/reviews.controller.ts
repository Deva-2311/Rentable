import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BORROWER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Submit a review for a completed rental (Borrower only)',
  })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return {
      success: true,
      data: await this.reviewsService.create(
        String(req.user._id),
        createReviewDto,
      ),
    };
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get all reviews for a product' })
  async findByProduct(@Param('productId') productId: string) {
    return {
      success: true,
      data: await this.reviewsService.findByProduct(productId),
    };
  }
}
