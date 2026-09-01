/**
 * Admin Seeder Script
 *
 * Usage:
 *   npm run seed:admin
 *
 * This file is excluded from the NestJS production build via tsconfig.build.json.
 */
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const MONGO_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/rentable';

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ['borrower', 'owner', 'admin'],
      default: 'borrower',
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

async function seedAdmin(): Promise<void> {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    // Register the model AFTER connecting on the default connection
    const UserModel =
      mongoose.models['User'] ?? mongoose.model<any>('User', UserSchema);

    const accounts = [
      { email: 'admin@rentable.com', name: 'Rentable Admin', role: 'admin' },
      { email: 'owner@rentable.com', name: 'Rentable Owner', role: 'owner' },
      { email: 'borrower@rentable.com', name: 'Rentable Borrower', role: 'borrower' },
    ];

    for (const account of accounts) {
      const existing = await UserModel.findOne({ email: account.email });
      if (existing) {
        console.log(`ℹ️  ${account.role} '${account.email}' already exists. Skipping.`);
      } else {
        console.log(`⏳ Creating ${account.role} user '${account.email}'...`);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        await UserModel.create({
          fullName: account.name,
          email: account.email,
          password: hashedPassword,
          role: account.role,
          isVerified: true,
          isActive: true,
        });

        console.log(`🎉 ${account.role} user created successfully!`);
        console.log(`   Email   : ${account.email}`);
        console.log(`   Password: password123`);
        console.log(`   Role    : ${account.role}`);
        console.log('--------------------------------------');
      }
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

seedAdmin();
