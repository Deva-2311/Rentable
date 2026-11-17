import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';
import { ProductStatus } from './schemas/product.schema';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (Owner only)' })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() createProductDto: CreateProductDto,
  ) {
    return {
      success: true,
      data: await this.productsService.create(
        String(req.user._id),
        createProductDto,
      ),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Search and filter active products' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'minPrice', required: false })
  @ApiQuery({ name: 'maxPrice', required: false })
  @ApiQuery({ name: 'condition', required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['price_asc', 'price_desc', 'rating', 'newest'],
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(@Query() query: any) {
    const result = await this.productsService.findAll(query);
    return {
      success: true,
      message: 'Products retrieved successfully',
      data: result.products,
      pagination: result.pagination,
    };
  }

  @Get('my-products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current owner products' })
  async findMyProducts(@Req() req: AuthenticatedRequest) {
    return {
      success: true,
      data: await this.productsService.findByOwner(String(req.user._id)),
    };
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'Check product availability' })
  @ApiQuery({ name: 'startDate', required: true })
  @ApiQuery({ name: 'endDate', required: true })
  async checkAvailability(
    @Param('id') id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return {
      success: true,
      data: { available: true },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product details by ID' })
  async findOne(@Param('id') id: string) {
    return {
      success: true,
      data: await this.productsService.findById(id),
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product (Owner or Admin)' })
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return {
      success: true,
      data: await this.productsService.update(
        id,
        String(req.user._id),
        updateProductDto,
        req.user.role,
      ),
    };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set product status (Admin only)' })
  async setStatus(
    @Param('id') id: string,
    @Body('status') status: ProductStatus,
  ) {
    return {
      success: true,
      data: await this.productsService.setStatus(id, status),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product (Owner or Admin)' })
  async remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    await this.productsService.remove(id, String(req.user._id), req.user.role);
    return {
      success: true,
      message: 'Product removed successfully',
    };
  }
}
