/**
 * Data Seeder Script
 *
 * Usage:
 *   npx ts-node scripts/seed-data.ts
 */
import * as crypto from 'crypto';
if (typeof globalThis.crypto === 'undefined') {
  (globalThis as any).crypto = { getRandomValues: crypto.webcrypto?.getRandomValues.bind(crypto.webcrypto) };
}

import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rentable';

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['borrower', 'owner', 'admin'], default: 'borrower' },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    image: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: [String],
    pricePerDay: { type: Number, required: true },
    securityDeposit: { type: Number, required: true },
    condition: { type: String, required: true },
    location: { type: String, required: true },
    availability: { type: Boolean, default: true },
    rentalRules: String,
    cancellationPolicy: String,
    status: { type: String, enum: ['DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'PAUSED', 'REJECTED', 'REMOVED'], default: 'ACTIVE' },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

async function seedData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    const UserModel = mongoose.models['User'] ?? mongoose.model<any>('User', UserSchema);
    const CategoryModel = mongoose.models['Category'] ?? mongoose.model<any>('Category', CategorySchema);
    const ProductModel = mongoose.models['Product'] ?? mongoose.model<any>('Product', ProductSchema);

    // 1. Seed Categories
    console.log('⏳ Seeding Categories...');
    const categoriesData = [
      { name: 'Cameras', slug: 'cameras', description: 'Photography and video equipment' },
      { name: 'Bikes', slug: 'bikes', description: 'Bicycles and related gear' },
      { name: 'Tools', slug: 'tools', description: 'Power tools and hand tools' },
      { name: 'Electronics', slug: 'electronics', description: 'Laptops, tablets, and gadgets' },
    ];
    const categories = [];
    for (const cat of categoriesData) {
      let doc = await CategoryModel.findOne({ slug: cat.slug });
      if (!doc) {
        doc = await CategoryModel.create(cat);
      }
      categories.push(doc);
    }
    const catMap = {
      cameras: categories.find(c => c.slug === 'cameras')._id,
      bikes: categories.find(c => c.slug === 'bikes')._id,
      tools: categories.find(c => c.slug === 'tools')._id,
      electronics: categories.find(c => c.slug === 'electronics')._id,
    };

    // 2. Seed Users
    console.log('⏳ Seeding Users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const usersData = Array.from({ length: 5 }).map((_, i) => ({
      fullName: `Owner User ${i + 1}`,
      email: `owner${i + 1}@rentable.com`,
      password: hashedPassword,
      role: 'owner',
      isVerified: true,
      isActive: true,
    }));
    // Add some borrowers
    usersData.push(...Array.from({ length: 5 }).map((_, i) => ({
      fullName: `Borrower User ${i + 1}`,
      email: `borrower${i + 1}@rentable.com`,
      password: hashedPassword,
      role: 'borrower',
      isVerified: true,
      isActive: true,
    })));

    const users = [];
    for (const u of usersData) {
      let doc = await UserModel.findOne({ email: u.email });
      if (!doc) {
        doc = await UserModel.create(u);
      }
      users.push(doc);
    }
    const owners = users.filter(u => u.role === 'owner');

    // 3. Seed Products
    console.log('⏳ Seeding Products...');
    await ProductModel.deleteMany({}); // clear existing products for a fresh seed of these items

    const productsData = [
      {
        owner: owners[0]._id,
        name: 'Sony A7IV Mirrorless Camera',
        slug: 'sony-a7iv-mirrorless-camera',
        description: 'Professional full-frame mirrorless camera. Perfect for events and high-end video production. Includes 24-70mm GM lens.',
        category: catMap.cameras,
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        pricePerDay: 4500,
        securityDeposit: 15000,
        condition: 'Excellent',
        location: 'Downtown Studio',
        availability: true,
        status: 'ACTIVE',
        rating: 4.9,
        reviewCount: 12
      },
      {
        owner: owners[1]._id,
        name: 'Trek Marlin 7 Mountain Bike',
        slug: 'trek-marlin-7-mountain-bike',
        description: 'Great hardtail mountain bike for weekend trails. Well maintained, comes with helmet and lock.',
        category: catMap.bikes,
        images: ['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        pricePerDay: 800,
        securityDeposit: 3000,
        condition: 'Good',
        location: 'North Park',
        availability: true,
        status: 'ACTIVE',
        rating: 4.5,
        reviewCount: 8
      },
      {
        owner: owners[2]._id,
        name: 'Makita Cordless Drill Set',
        slug: 'makita-cordless-drill-set',
        description: '18V cordless drill and impact driver combo. Includes 2 batteries and charger. Ideal for home projects.',
        category: catMap.tools,
        images: ['https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        pricePerDay: 400,
        securityDeposit: 1500,
        condition: 'Like New',
        location: 'Westside',
        availability: true,
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 24
      },
      {
        owner: owners[3]._id,
        name: 'MacBook Pro 16" M2 Max',
        slug: 'macbook-pro-16-m2-max',
        description: 'Extremely powerful laptop for video editing or heavy rendering. 32GB RAM, 1TB SSD.',
        category: catMap.electronics,
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        pricePerDay: 2500,
        securityDeposit: 20000,
        condition: 'Excellent',
        location: 'Tech Hub, South',
        availability: true,
        status: 'ACTIVE',
        rating: 5.0,
        reviewCount: 5
      },
      {
        owner: owners[4]._id,
        name: 'DJI Mavic 3 Drone',
        slug: 'dji-mavic-3-drone',
        description: 'Cinematic drone with Hasselblad camera. Includes fly more combo (3 batteries).',
        category: catMap.cameras,
        images: ['https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        pricePerDay: 3500,
        securityDeposit: 10000,
        condition: 'Excellent',
        location: 'East Village',
        availability: true,
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 15
      },
      {
        owner: owners[0]._id,
        name: 'Vintage Film Camera (Canon AE-1)',
        slug: 'vintage-film-camera-canon-ae-1',
        description: 'Classic 35mm film camera. Comes with a 50mm f/1.8 lens. Film not included.',
        category: catMap.cameras,
        images: ['https://images.unsplash.com/photo-1495121553079-4c61bcce1894?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        pricePerDay: 600,
        securityDeposit: 2500,
        condition: 'Good',
        location: 'Downtown Studio',
        availability: true,
        status: 'ACTIVE',
        rating: 4.6,
        reviewCount: 19
      },
      {
        owner: owners[1]._id,
        name: 'Road Bike - Specialized Allez',
        slug: 'road-bike-specialized-allez',
        description: 'Fast and lightweight road bike for long rides. Shimano gears.',
        category: catMap.bikes,
        images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        pricePerDay: 1000,
        securityDeposit: 5000,
        condition: 'Excellent',
        location: 'North Park',
        availability: true,
        status: 'ACTIVE',
        rating: 4.9,
        reviewCount: 31
      },
      {
        owner: owners[2]._id,
        name: 'Heavy Duty Pressure Washer',
        slug: 'heavy-duty-pressure-washer',
        description: 'Electric pressure washer for cleaning driveways, cars, and patios.',
        category: catMap.tools,
        images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        pricePerDay: 700,
        securityDeposit: 2000,
        condition: 'Good',
        location: 'Westside',
        availability: true,
        status: 'ACTIVE',
        rating: 4.2,
        reviewCount: 9
      },
      {
        owner: owners[3]._id,
        name: 'iPad Pro 12.9" with Apple Pencil',
        slug: 'ipad-pro-12-9-with-apple-pencil',
        description: 'Perfect for digital artists or taking notes. M1 chip, 256GB.',
        category: catMap.electronics,
        images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        pricePerDay: 1200,
        securityDeposit: 6000,
        condition: 'Like New',
        location: 'Tech Hub, South',
        availability: true,
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 14
      },
      {
        owner: owners[4]._id,
        name: 'Nintendo Switch OLED',
        slug: 'nintendo-switch-oled',
        description: 'Comes with Mario Kart 8 and Zelda. Great for weekend gaming.',
        category: catMap.electronics,
        images: ['https://images.unsplash.com/photo-1612282130134-49784d98ac61?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
        pricePerDay: 500,
        securityDeposit: 3000,
        condition: 'Good',
        location: 'East Village',
        availability: true,
        status: 'ACTIVE',
        rating: 4.9,
        reviewCount: 42
      }
    ];

    await ProductModel.insertMany(productsData);

    console.log('🎉 Seeded 10 products successfully!');
    console.log('🎉 Seeded 10 users successfully! (5 owners, 5 borrowers, passwords: password123)');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

seedData();
