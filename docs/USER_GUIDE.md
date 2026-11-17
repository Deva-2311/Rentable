# RENTABLE — Official User Guide & Role Operations Manual
**Step-by-Step Practical Manual for Borrowers, Equipment Owners, and System Administrators**

---

## 1. Borrower Operations Guide

### 1.1 Account Setup & Authentication
1. Navigate to `http://localhost:3000/signup`.
2. Enter your Full Name, Email, Password, and select the **Borrower** account role.
3. Once registered, log in at `/login`.
4. Your authenticated session will persist in `localStorage`, giving you immediate access to your borrower dashboard and checkout features.

### 1.2 Product Discovery & Search
- **Home & Explore Pages (`/` and `/explore`):** Browse featured items, recent listings, and curated categories (Cameras, Mobility, Electronics, Tools, Outdoor Gear).
- **Search & Filters:** Use the search bar to search gear titles or locations. Filter by:
  - Price Range (Minimum and Maximum daily rate in ₹).
  - Category taxonomy.
  - Condition (New, Like New, Good, Fair).

### 1.3 Reviewing Product Details & Choosing Dates
1. Click on any product card to open its detail page (`/products/[id]`).
2. Review specifications, owner location, security deposit amount, and rental rules.
3. Select your desired **Pickup Date** and **Return Date** on the interactive calendar selector.
4. The system validates availability in real time and automatically computes:
   - Rental Duration (in days).
   - Equipment Rental Subtotal ($pricePerDay \times duration$).
   - Security Deposit (held in escrow, 100% refundable).
   - Platform Service Fee ($10\%$ marketplace commission).
   - Total Payable Amount.

### 1.4 Booking & Checkout Flow
1. Click **"Rent Now"** or **"Proceed to Checkout"**.
2. You will be routed to `/checkout/[id]`.
3. Select your payment method:
   - **Simulation Mode (Academic Demo):** Click *"Simulate Successful Payment"*. This validates the order, creates a payment record in MongoDB, sets booking status to `ACTIVE`, and generates a physical rental handover record.
   - You can also test *"Simulate Payment Failure"* to observe transaction decline handling.
4. Upon payment success, you are redirected to the Booking Confirmation screen (`/booking/[id]/confirmation`) with your reference code (e.g. `BKG-941831-337`).

### 1.5 Managing Active Rentals & Returns
1. Navigate to `/borrower/rentals` or `/borrower/dashboard`.
2. Under **"Active Rentals"**, view your rented equipment, due return date, and owner contact details.
3. When your rental period concludes, click **"Request Return"**. This notifies the owner to inspect the equipment.

### 1.6 Rating & Reviews
- Once the rental is finalized, open your booking history to leave a 1 to 5 star rating and feedback comment to build community trust.

---

## 2. Equipment Owner Operations Guide

### 2.1 Owner Dashboard Overview
- Navigate to `/owner` (which redirects to `/owner/dashboard`).
- The Bento Analytics grid presents 4 live metrics from MongoDB:
  1. **Total Earnings:** Net revenue settled from paid bookings.
  2. **Listed Gear:** Total active items you have cataloged.
  3. **Active Rentals:** Items currently in borrower custody.
  4. **Pending Requests:** Inbound booking applications requiring approval.

### 2.2 Listing New Equipment
1. Click the **"List New Item"** button on the dashboard or navigate to `/owner/products`.
2. Fill out the asset parameters:
   - Title, Description, and Category classification.
   - Daily rental price (₹) and required refundable security deposit (₹).
   - Equipment condition (New, Like New, Good, Fair).
   - Physical location / pickup neighborhood.
3. **Upload Media:** Drag & drop up to 5 photos. They are automatically uploaded and optimized via Cloudinary.
4. Click **"Publish Listing"**. The asset immediately appears in the public catalog and under your listings.

### 2.3 Managing Existing Listings (`/owner/products`)
- **Live Search & Filter:** Filter items by status pills (`All`, `Active`, `Paused`) or search by name.
- **Table vs Grid Toggle:** Switch views without losing search state.
- **Action Menu (Three Dots):**
  - **View Listing:** Jump to public product page.
  - **Edit Details:** Opens the `EditProductModal` to update pricing, description, condition, rules, or photos.
  - **Pause / Activate:** Temporarily take gear off the market or make it active.
  - **Delete Listing:** Permanently remove gear with a safety confirmation dialog.

### 2.4 Managing Rental Requests (`/owner/bookings`)
1. Inbound requests appear under the **Requests** tab with status `PENDING`.
2. Inspect the borrower name, rental dates, duration, and projected earnings.
3. Click **"Accept"** to confirm the reservation or **"Decline"** to free up dates.

### 2.5 Fleet Schedule & Calendar (`/owner/calendar`)
1. View an interactive month grid showing bookings overlaid as color-coded status chips:
   - **Green:** Active rentals.
   - **Blue:** Confirmed upcoming reservations.
   - **Amber:** Pending requests.
2. Filter the schedule by **"All Products"** or select a specific asset from the dropdown.
3. Click on any booked day or chip to inspect the booking details modal.

### 2.6 Financial Ledger & Payouts (`/owner/earnings`)
1. Track available earnings, escrow amounts, and pending revenue.
2. View the itemized **Transaction Ledger** listing booking references, amounts, and dates.
3. Click **"Export CSV"** to download an itemized spreadsheet of your rental income.
4. Click **"Withdraw Funds"** to submit a payout transfer request to your linked bank account or UPI ID.

---

## 3. System Administrator Operations Guide

### 3.1 Platform Governance Dashboard (`/admin/dashboard`)
- High-level KPIs: Total registered users, cataloged equipment, cumulative bookings, and platform revenue.

### 3.2 User Directory & Suspension (`/admin/people`)
- Inspect all registered accounts across roles (`borrower`, `owner`, `admin`).
- Search users by name or email.
- **Account Suspension:** Open user details modal $\rightarrow$ click **"Suspend User"** $\rightarrow$ provide administrative reason. The account is set to `isActive: false` and the action is recorded in the compliance audit log.

### 3.3 Marketplace Moderation (`/admin/marketplace`)
- **Products (`/admin/marketplace/products`):** Review listed items, inspect pricing and condition, edit details, or remove fraudulent listings.
- **Categories (`/admin/marketplace/categories`):** Add new rental categories, edit taxonomy slugs, or delete unused classifications.
- **Bookings (`/admin/marketplace/bookings`):** System-wide ledger of all reservations with status overrides.

### 3.4 Trust, Safety & Disputes (`/admin/trust` and `/disputes`)
- **Audit Logs:** Full immutable log of every administrative intervention (timestamps, acting admin ID, target entity, pre-mutation state, and reason).
- **Dispute Resolution:** Inspect open dispute cases between borrowers and owners. Review submitted photos and statements, then issue formal settlements (`REFUND_BORROWER`, `DEDUCT_DEPOSIT`, or `RELEASE_OWNER_PAYMENT`).
