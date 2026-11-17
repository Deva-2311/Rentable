import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../../common/enums/role.enum';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop()
  phone?: string;

  @Prop({ required: true, select: false })
  password?: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(UserRole),
    default: UserRole.BORROWER,
  })
  role!: UserRole;

  @Prop()
  avatar?: string;

  @Prop({ default: false })
  isVerified!: boolean;

  @Prop({
    type: String,
    enum: [
      'PENDING',
      'UNDER_REVIEW',
      'VERIFIED',
      'REJECTED',
      'MORE_INFO_REQUIRED',
    ],
    default: 'PENDING',
  })
  verificationStatus?: string;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop()
  suspensionReason?: string;

  @Prop({ type: [String], default: [] })
  permissions?: string[];

  @Prop({ default: 0 })
  walletBalance!: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hash password before saving
UserSchema.pre<UserDocument>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
UserSchema.methods.comparePassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};
