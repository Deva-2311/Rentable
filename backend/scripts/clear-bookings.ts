import { connect, connection } from 'mongoose';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rentable';

async function clearAllBookings() {
  console.log('Connecting to database:', MONGODB_URI);
  await connect(MONGODB_URI);

  const db = connection.db;
  if (!db) {
    throw new Error('Database connection failed');
  }

  console.log('\n--- Current Collection Counts ---');
  const collectionsToCheck = [
    'bookings',
    'rentals',
    'payments',
    'reviews',
    'disputes',
    'deposits',
    'notifications',
  ];

  for (const name of collectionsToCheck) {
    const count = await db.collection(name).countDocuments();
    console.log(`- ${name}: ${count}`);
  }

  console.log('\nPurging all bookings and dependent rental/payment/review records...');

  // 1. Clear bookings
  const bookingsRes = await db.collection('bookings').deleteMany({});
  console.log(`✓ Deleted ${bookingsRes.deletedCount} bookings`);

  // 2. Clear rentals
  const rentalsRes = await db.collection('rentals').deleteMany({});
  console.log(`✓ Deleted ${rentalsRes.deletedCount} rentals`);

  // 3. Clear payments
  const paymentsRes = await db.collection('payments').deleteMany({});
  console.log(`✓ Deleted ${paymentsRes.deletedCount} payments`);

  // 4. Clear reviews linked to bookings
  const reviewsRes = await db.collection('reviews').deleteMany({});
  console.log(`✓ Deleted ${reviewsRes.deletedCount} reviews`);

  // 5. Clear disputes & deposits if any
  const disputesRes = await db.collection('disputes').deleteMany({});
  console.log(`✓ Deleted ${disputesRes.deletedCount} disputes`);

  const depositsRes = await db.collection('deposits').deleteMany({});
  console.log(`✓ Deleted ${depositsRes.deletedCount} deposits`);

  // 6. Clear notifications
  const notifRes = await db.collection('notifications').deleteMany({});
  console.log(`✓ Deleted ${notifRes.deletedCount} notifications`);

  // 7. Clear booking-related audit logs
  const auditRes = await db.collection('auditlogs').deleteMany({
    targetType: { $in: ['Booking', 'Rental', 'Payment', 'Review'] },
  });
  console.log(`✓ Deleted ${auditRes.deletedCount} booking-related audit logs`);

  // 8. Ensure all products are available and have 0 ratings / reviewCount
  const productUpdateRes = await db.collection('products').updateMany(
    {},
    {
      $set: {
        availability: true,
        rating: 0,
        reviewCount: 0,
      },
    },
  );
  console.log(`✓ Reset availability & ratings for ${productUpdateRes.matchedCount} products`);

  console.log('\n--- Final Verification Counts ---');
  for (const name of collectionsToCheck) {
    const count = await db.collection(name).countDocuments();
    console.log(`- ${name}: ${count}`);
  }

  console.log('\nSystem is now clean: 0 bookings exist, and all products are open for fresh bookings!');
  process.exit(0);
}

clearAllBookings().catch((err) => {
  console.error('Error clearing bookings:', err);
  process.exit(1);
});
