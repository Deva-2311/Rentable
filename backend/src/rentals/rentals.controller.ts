import {
  Controller,
  Get,
  Post,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { RentalsService } from './rentals.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';

@ApiTags('Rentals')
@Controller('rentals')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Get('active')
  @ApiOperation({ summary: 'Get active rentals for the current user' })
  async getActive(@Req() req: AuthenticatedRequest) {
    const isOwner = req.user.role === UserRole.OWNER;
    return {
      success: true,
      data: await this.rentalsService.getActiveRentals(
        String(req.user._id),
        isOwner,
      ),
    };
  }

  @Get('history')
  @ApiOperation({ summary: 'Get rental history for the current user' })
  async getHistory(@Req() req: AuthenticatedRequest) {
    const isOwner = req.user.role === UserRole.OWNER;
    return {
      success: true,
      data: await this.rentalsService.getHistory(String(req.user._id), isOwner),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all rentals for the current user' })
  async getAll(@Req() req: AuthenticatedRequest) {
    const isOwner = req.user.role === UserRole.OWNER;
    return {
      success: true,
      data: await this.rentalsService.getAllRentals(
        String(req.user._id),
        isOwner,
      ),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rental details by ID' })
  async findOne(@Param('id') id: string) {
    return {
      success: true,
      data: await this.rentalsService.findById(id),
    };
  }

  @Post(':id/return-request')
  @Roles(UserRole.BORROWER)
  @ApiOperation({ summary: 'Borrower requests to return the rental' })
  async requestReturn(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return {
      success: true,
      data: await this.rentalsService.requestReturn(id, String(req.user._id)),
    };
  }

  @Patch(':id/complete')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Owner confirms return and completes rental' })
  async completeRental(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return {
      success: true,
      data: await this.rentalsService.completeRental(id, String(req.user._id)),
    };
  }
}
