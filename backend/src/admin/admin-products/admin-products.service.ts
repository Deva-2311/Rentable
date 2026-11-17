import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Product,
  ProductDocument,
  ProductStatus,
} from '../../products/schemas/product.schema';
import {
  AuditLog,
  AuditLogDocument,
} from '../../audit/schemas/audit-log.schema';

@Injectable()
export class AdminProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  async getPendingProducts() {
    return this.productModel
      .find({ status: ProductStatus.PENDING_APPROVAL })
      .populate('owner', 'fullName email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async approveProduct(productId: string, adminId: string, adminRole: string) {
    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    const previousState = { status: product.status };

    // Assuming status can be set to ACTIVE
    product.status = ProductStatus.ACTIVE;
    await product.save();

    await this.auditLogModel.create({
      adminId: new Types.ObjectId(adminId),
      adminRole,
      action: 'PRODUCT_APPROVED',
      targetType: 'Product',
      targetId: new Types.ObjectId(productId),
      previousState,
      newState: { status: ProductStatus.ACTIVE },
    });

    return product;
  }

  async rejectProduct(
    productId: string,
    reason: string,
    adminId: string,
    adminRole: string,
  ) {
    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    const previousState = { status: product.status };

    // Assuming status can be set to REJECTED
    product.status = ProductStatus.REJECTED;
    await product.save();

    await this.auditLogModel.create({
      adminId: new Types.ObjectId(adminId),
      adminRole,
      action: 'PRODUCT_REJECTED',
      targetType: 'Product',
      targetId: new Types.ObjectId(productId),
      previousState,
      newState: { status: 'REJECTED' },
      reason,
    });

    return product;
  }
}
