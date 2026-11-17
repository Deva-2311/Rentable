import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';
import { BookingStatus } from './schemas/booking.schema';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(UserRole.BORROWER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new booking (Borrower only)' })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return {
      success: true,
      data: await this.bookingsService.create(
        String(req.user._id),
        createBookingDto,
      ),
    };
  }

  @Get('my-bookings')
  @Roles(UserRole.BORROWER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get current borrower bookings' })
  async findMyBookings(@Req() req: AuthenticatedRequest) {
    return {
      success: true,
      data: await this.bookingsService.findByBorrower(String(req.user._id)),
    };
  }

  @Get('owner/requests')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Get booking requests for owner products' })
  async findOwnerRequests(@Req() req: AuthenticatedRequest) {
    return {
      success: true,
      data: await this.bookingsService.findByOwner(String(req.user._id)),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  async findOne(@Param('id') id: string) {
    return {
      success: true,
      data: await this.bookingsService.findById(id),
    };
  }

  @Patch(':id/accept')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Accept a booking request (Owner only)' })
  async acceptBooking(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return {
      success: true,
      data: await this.bookingsService.updateStatus(
        id,
        BookingStatus.CONFIRMED,
        String(req.user._id),
        true,
      ),
    };
  }

  @Patch(':id/reject')
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Reject a booking request (Owner only)' })
  async rejectBooking(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return {
      success: true,
      data: await this.bookingsService.updateStatus(
        id,
        BookingStatus.REJECTED,
        String(req.user._id),
        true,
      ),
    };
  }

  @Patch(':id/cancel')
  @Roles(UserRole.BORROWER)
  @ApiOperation({
    summary: 'Cancel a booking (Borrower only, PENDING or CONFIRMED)',
  })
  async cancelBooking(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return {
      success: true,
      data: await this.bookingsService.cancelBooking(id, String(req.user._id)),
    };
  }
}
