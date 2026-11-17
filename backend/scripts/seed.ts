import { connect, connection, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rentable';

async function seed() {
  console.log('Connecting to database...');
  await connect(MONGODB_URI);
  console.log('Connected.');

  const db = connection.db;
  if (!db) throw new Error('Database not connected');

  // Create users
  const usersCollection = db.collection('users');
  const passwordHash = await bcrypt.hash('password123', 10);
  
  // Base users
  const adminId = new Types.ObjectId();
  const ownerId = new Types.ObjectId();
  const borrowerId = new Types.ObjectId();

  console.log('Seeding users...');
  const users = [
    { _id: adminId, email: 'admin@rentable.com', password: passwordHash, fullName: 'Admin User', role: 'admin', isVerified: true, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { _id: ownerId, email: 'owner@rentable.com', password: passwordHash, fullName: 'Owner User', role: 'owner', isVerified: true, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { _id: borrowerId, email: 'borrower@rentable.com', password: passwordHash, fullName: 'Borrower User', role: 'borrower', isVerified: true, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  ];

  for (let i = 1; i <= 25; i++) {
    users.push({
      _id: new Types.ObjectId(),
      email: `user${i}@example.com`,
      password: passwordHash,
      fullName: `Mock User ${i}`,
      role: i % 2 === 0 ? 'owner' : 'borrower',
      isVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await usersCollection.deleteMany({});
  await usersCollection.insertMany(users);

  // Categories
  console.log('Seeding categories...');
  const categoriesCollection = db.collection('categories');
  const categoryNames = ['Cameras', 'Gaming', 'Audio', 'Vehicles', 'Tools', 'Party', 'Outdoors', 'Fitness', 'Events', 'Drones'];
  const categories = categoryNames.map(name => ({
    _id: new Types.ObjectId(),
    name,
    slug: name.toLowerCase(),
    description: `Rent best ${name}`,
    icon: 'icon',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await categoriesCollection.deleteMany({});
  await categoriesCollection.insertMany(categories);

  // Products
  console.log('Seeding products...');
  const productsCollection = db.collection('products');
  const products = [];
  const owners = users.filter(u => u.role === 'owner');

  for (let i = 1; i <= 30; i++) {
    const category = categories[i % categories.length];
    const owner = owners[i % owners.length];
    products.push({
      _id: new Types.ObjectId(),
      owner: owner._id,
      name: `Premium ${category.name} Asset ${i}`,
      slug: `premium-${category.slug}-asset-${i}`,
      description: `This is a high quality ${category.name} available for rent. Perfect condition.`,
      category: category._id,
      images: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1505156868547-9b49f4df4e04?auto=format&fit=crop&q=80&w=800'
      ],
      pricePerDay: 500 + (i * 100),
      securityDeposit: 2000 + (i * 500),
      condition: 'Excellent',
      location: 'Bangalore, India',
      availability: true,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await productsCollection.deleteMany({});
  await productsCollection.insertMany(products);

  // Bookings, Rentals, Payments (Only seeded if explicitly requested with SEED_BOOKINGS=true)
  const bookingsCollection = db.collection('bookings');
  const rentalsCollection = db.collection('rentals');
  const paymentsCollection = db.collection('payments');
  const reviewsCollection = db.collection('reviews');

  // Always clear previous bookings, rentals, payments, reviews for a fresh state
  await bookingsCollection.deleteMany({});
  await rentalsCollection.deleteMany({});
  await paymentsCollection.deleteMany({});
  await reviewsCollection.deleteMany({});

  if (process.env.SEED_BOOKINGS === 'true') {
    console.log('SEED_BOOKINGS=true detected: Seeding mock bookings...');
    const bookings = [];
    const borrowers = users.filter(u => u.role === 'borrower');

    for (let i = 1; i <= 25; i++) {
      const product = products[i % products.length];
      const borrower = borrowers[i % borrowers.length];
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + (i % 5));
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 3);

      const statusOptions = ['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'];

      bookings.push({
        _id: new Types.ObjectId(),
        bookingId: `BKG-${Date.now()}-${i}`,
        product: product._id,
        borrower: borrower._id,
        owner: product.owner,
        startDate,
        endDate,
        duration: 3,
        rentalAmount: product.pricePerDay * 3,
        status: statusOptions[i % statusOptions.length],
        totalAmount: product.pricePerDay * 3,
        platformFee: Math.floor(product.pricePerDay * 3 * 0.1),
        securityDeposit: product.securityDeposit,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await bookingsCollection.insertMany(bookings);

    // Rentals
    console.log('Seeding rentals...');
    const rentals = [];
    const activeBookings = bookings.filter(b => b.status === 'ACTIVE' || b.status === 'COMPLETED');
    
    for (let i = 0; i < activeBookings.length; i++) {
      const b = activeBookings[i];
      rentals.push({
        _id: new Types.ObjectId(),
        booking: b._id,
        product: b.product,
        borrower: b.borrower,
        owner: b.owner,
        status: b.status === 'COMPLETED' ? 'COMPLETED' : 'ACTIVE',
        createdAt: b.createdAt,
        updatedAt: new Date(),
      });
    }

    if (rentals.length > 0) {
      await rentalsCollection.insertMany(rentals);
    }

    // Payments
    console.log('Seeding payments...');
    const payments = [];

    for (let i = 0; i < activeBookings.length; i++) {
      const b = activeBookings[i];
      payments.push({
        _id: new Types.ObjectId(),
        booking: b._id,
        user: b.borrower,
        amount: b.totalAmount + b.platformFee + b.securityDeposit,
        currency: 'INR',
        status: 'COMPLETED',
        razorpayOrderId: `order_mock_${i}`,
        razorpayPaymentId: `pay_mock_${i}`,
        createdAt: b.createdAt,
        updatedAt: new Date(),
      });
    }

    if (payments.length > 0) {
      await paymentsCollection.insertMany(payments);
    }
  } else {
    console.log('System initialized cleanly with 0 bookings (ready for new bookings).');
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
