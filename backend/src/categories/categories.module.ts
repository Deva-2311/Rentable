import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category, CategorySchema } from './schemas/category.schema';
import { AuditLog, AuditLogSchema } from '../audit/schemas/audit-log.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
