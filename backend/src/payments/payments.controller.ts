import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, VerifyPaymentDto, SimulatePaymentDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  @Roles(UserRole.BORROWER)
  @ApiOperation({ summary: 'Create Razorpay Order for a booking' })
  async createOrder(
    @Req() req: AuthenticatedRequest,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return {
      success: true,
      data: await this.paymentsService.createOrder(
        String(req.user._id),
        createPaymentDto,
      ),
    };
  }

  @Post('verify')
  @Roles(UserRole.BORROWER)
  @ApiOperation({ summary: 'Verify Razorpay Payment Signature' })
  async verifyPayment(@Body() verifyDto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(verifyDto);
  }

  @Post('simulate')
  @Roles(UserRole.BORROWER)
  @ApiOperation({ summary: 'Simulate Payment for a booking' })
  async simulatePayment(
    @Req() req: AuthenticatedRequest,
    @Body() simulateDto: SimulatePaymentDto,
  ) {
    return {
      success: true,
      data: await this.paymentsService.simulatePayment(
        String(req.user._id),
        simulateDto,
      ),
    };
  }
}
