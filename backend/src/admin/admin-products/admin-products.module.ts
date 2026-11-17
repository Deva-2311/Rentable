import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminProductsController } from './admin-products.controller';
import { AdminProductsService } from './admin-products.service';
import { Product, ProductSchema } from '../../products/schemas/product.schema';
import { AuditLog, AuditLogSchema } from '../../audit/schemas/audit-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
  ],
  controllers: [AdminProductsController],
  providers: [AdminProductsService],
})
export class AdminProductsModule {}
