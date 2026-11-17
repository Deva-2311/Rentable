# RENTABLE — Developer Setup & Installation Guide
**Local Development Environment Configuration, Execution, and Verification Manual**

---

## 1. System Prerequisites

Ensure the host workstation meets the following minimum toolchain requirements:

| Tool | Verified Version | Purpose | Notes |
|---|---|---|---|
| **Node.js** | `>= 20.0.0` (Verified on Node 24) | JavaScript / TypeScript Runtime | Download from [nodejs.org](https://nodejs.org). |
| **npm** | `>= 9.0.0` | Package Dependency Manager | Included with Node.js. |
| **MongoDB** | `>= 6.0.0` (Community or Atlas) | NoSQL Database Server | Local instance at `mongodb://localhost:27017` or Atlas URI. |
| **Git** | `>= 2.30.0` | Source Code Control | Standard CLI. |

---

## 2. Repository Cloning & Dependency Installation

1. **Clone the repository:**
   ```bash
   git clone <repository_url> rentable
   cd rentable
   ```

2. **One-Command Installation (Root):**
   Install root, backend, and frontend packages simultaneously:
   ```bash
   npm run install:all
   ```

   *Alternatively, install independently:*
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   ```

---

## 3. Environment Variable Configuration

### 3.1 Backend Environment Configuration
Create or verify `backend/.env`:

```env
# Application Server
PORT=5000
NODE_ENV=development

# Database Connection
MONGO_URI=mongodb://localhost:27017/rentable

# Authentication & Security
JWT_SECRET=your_super_secret_jwt_key_for_development_min_32_chars
JWT_EXPIRATION=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key_min_32_chars
REFRESH_TOKEN_EXPIRATION=30d

# CORS Allowed Origin
FRONTEND_URL=http://localhost:3000

# Cloudinary Storage (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay Payment Gateway (Optional for live orders, simulation works without)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3.2 Frontend Environment Configuration
Create or verify `frontend/.env.local`:

```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Optional Razorpay Public Key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

---

## 4. Database Initialization & Seeding

The repository includes pre-built database seeding scripts to instantly create realistic demonstration data (categories, test users across all roles, verified products, and bookings).

Run the seed script from the project root:
```bash
npm run seed
```

This populates:
- **Default Accounts:**
  - **Admin:** `admin@rentable.com` / `password123`
  - **Borrower:** `borrower@rentable.com` / `password123`
  - **Owner:** `owner@rentable.com` / `password123`
- **Product Categories:** Vehicles, Cameras & Photography, Electronics, Tools, Outdoor Equipment.
- **Sample Listings:** Cameras, drones, e-bikes, and camping gear with pricing and security deposits.

To reset bookings back to a clean slate during testing:
```bash
npm run clear:bookings
```

---

## 5. Running the Application Locally

### 5.1 Concurrent Execution (Recommended)
Start both frontend and backend concurrently from the root directory:
```bash
npm run dev
```

### 5.2 Standalone Execution

**Terminal 1 — Backend (NestJS on Port 5000):**
```bash
cd backend
npm run start:dev
```
*Health Check:* Open `http://localhost:5000/api/health` or `http://localhost:5000/api/products`.  
*API Swagger Documentation:* Open `http://localhost:5000/api/docs`.

**Terminal 2 — Frontend (Next.js on Port 3000):**
```bash
cd frontend
npm run dev
```
*Application Access:* Open `http://localhost:3000` in your web browser.

---

## 6. Build & Compilation Verification

Before submitting or deploying, ensure both packages compile with zero TypeScript errors:

```bash
# Verify Backend Build
npm --prefix backend run build
# Expected Output: nest build completes with code 0

# Verify Frontend Production Build
npm --prefix frontend run build
# Expected Output: Next.js compiles 43/43 static & dynamic routes with code 0
```

---

## 7. Troubleshooting Common Issues

1. **Port 5000 or 3000 already in use:**
   ```bash
   lsof -i :5000
   lsof -i :3000
   # Terminate the lingering process: kill -9 <PID>
   ```

2. **MongoDB Connection Refused:**
   Ensure your local MongoDB daemon is running:
   ```bash
   sudo systemctl status mongod
   # Or start via: sudo systemctl start mongod
   ```

3. **Session Expired or 401 Loops:**
   Open browser Developer Tools $\rightarrow$ Application $\rightarrow$ Local Storage $\rightarrow$ Clear `accessToken` and `user`, then re-authenticate at `/login`.
