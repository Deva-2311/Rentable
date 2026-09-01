import { Controller, Get, Post, Body, Param, UseGuards, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category (Admin only)' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return {
      success: true,
      data: await this.categoriesService.create(createCategoryDto),
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
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category (Admin only)' })
  async update(@Param('id') id: string, @Body() updateCategoryDto: any) {
    return {
      success: true,
      data: await this.categoriesService.update(id, updateCategoryDto),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category (Admin only)' })
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(id);
    return {
      success: true,
      message: 'Category removed successfully',
    };
  }
}
