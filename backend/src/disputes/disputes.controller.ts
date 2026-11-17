import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';
import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';

@ApiTags('Disputes')
@Controller('disputes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post()
  @ApiOperation({ summary: 'Open a new dispute for a rental booking' })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() createDisputeDto: CreateDisputeDto,
  ) {
    const dispute = await this.disputesService.create(
      String(req.user._id),
      req.user.role,
      createDisputeDto,
    );
    return {
      success: true,
      message: 'Dispute submitted successfully',
      data: dispute,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all disputes for the current user (or all if admin)' })
  async findAll(@Req() req: AuthenticatedRequest) {
    const disputes = await this.disputesService.findAll(
      String(req.user._id),
      req.user.role,
    );
    return {
      success: true,
      data: disputes,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific dispute' })
  async findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    const dispute = await this.disputesService.findOne(
      id,
      String(req.user._id),
      req.user.role,
    );
    return {
      success: true,
      data: dispute,
    };
  }

  @Patch(':id/resolve')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Resolve a dispute (Admin only)' })
  async resolve(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() resolveDisputeDto: ResolveDisputeDto,
  ) {
    const dispute = await this.disputesService.resolve(
      id,
      String(req.user._id),
      resolveDisputeDto,
    );
    return {
      success: true,
      message: 'Dispute resolved successfully',
      data: dispute,
    };
  }
}
