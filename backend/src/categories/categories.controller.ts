import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';
import { AuditLog, AuditLogDocument } from '../audit/schemas/audit-log.schema';
import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category (Admin only)' })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const category = await this.categoriesService.create(createCategoryDto);

    if (req.user) {
      await this.auditLogModel.create({
        adminId: new Types.ObjectId(String(req.user._id)),
        adminRole: req.user.role,
        action: 'CATEGORY_CREATED',
        targetType: 'Category',
        targetId: category._id,
        newState: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
          isActive: category.isActive,
        },
        reason: 'Admin created category',
      });
    }

    return {
      success: true,
      data: category,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all active categories' })
  async findAll() {
    return {
      success: true,
      data: await this.categoriesService.findAll(),
    };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get category by slug' })
  async findOne(@Param('slug') slug: string) {
    return {
      success: true,
      data: await this.categoriesService.findBySlug(slug),
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category (Admin only)' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: any,
    @Req() req: AuthenticatedRequest,
  ) {
    const category = await this.categoriesService.update(id, updateCategoryDto);

    if (req.user) {
      await this.auditLogModel.create({
        adminId: new Types.ObjectId(String(req.user._id)),
        adminRole: req.user.role,
        action: 'CATEGORY_UPDATED',
        targetType: 'Category',
        targetId: category._id,
        newState: updateCategoryDto,
        reason: 'Admin updated category',
      });
    }

    return {
      success: true,
      data: category,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category (Admin only)' })
  async remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.categoriesService.remove(id);

    if (req.user) {
      await this.auditLogModel.create({
        adminId: new Types.ObjectId(String(req.user._id)),
        adminRole: req.user.role,
        action: 'CATEGORY_DELETED',
        targetType: 'Category',
        targetId: new Types.ObjectId(id),
        reason: 'Admin removed category',
      });
    }

    return {
      success: true,
      message: 'Category removed successfully',
    };
  }
}
