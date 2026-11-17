# RENTABLE — REST API Specification & Endpoint Reference
**Official Backend HTTP API Contracts & Network Architecture**

---

## 1. Network & Protocol Conventions

- **Base URL:** `http://localhost:5000/api` (Development) / Set via `NEXT_PUBLIC_API_URL`
- **Data Exchange Format:** `application/json` (except media upload endpoints which accept `multipart/form-data`)
- **Authentication Scheme:** HTTP Bearer Authentication with JSON Web Tokens (JWT)
  - Header: `Authorization: Bearer <accessToken>`
- **Response Enveloping:** Responses are standardized in a uniform JSON envelope:
  ```json
  {
    "success": true,
    "message": "Human readable status description (optional)",
    "data": { ... },
    "pagination": { "page": 1, "limit": 12, "total": 31, "totalPages": 3 }
  }
  ```
- **Error Enveloping:**
  ```json
  {
    "statusCode": 400,
    "message": "Specific validation failure or domain error message",
    "error": "Bad Request",
    "timestamp": "2026-10-25T15:03:57.124Z",
    "path": "/api/bookings"
  }
  ```

---

## 2. Authentication & Identity (`/api/auth`)

### 2.1 Register New Account
- **Route:** `POST /api/auth/register`
- **Auth:** Public
- **Request Body:**
  ```json
  {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePassword123!",
    "phone": "+91 9876543210",
    "role": "borrower"
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "6ac287338e801e85e6811499",
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "role": "borrower",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
- **Errors:** `400 Bad Request` (Email already registered, invalid input).

### 2.2 User Login
- **Route:** `POST /api/auth/login`
- **Auth:** Public
- **Request Body:**
  ```json
  {
    "email": "borrower@rentable.com",
    "password": "password123"
  }
  ```
- **Response (`201 Created` / `200 OK`):**
  ```json
  {
    "_id": "6ac287338e801e85e6811415",
    "name": "Borrower User",
    "fullName": "Borrower User",
    "email": "borrower@rentable.com",
    "role": "borrower",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "9c7c4d4f0f2069b5f41c076e40604c6d..."
  }
  ```
- **Errors:** `401 Unauthorized` (Invalid credentials, inactive or suspended account).

### 2.3 Get Current User Profile
- **Route:** `GET /api/auth/profile`
- **Auth:** Bearer Token
- **Response (`200 OK`):** Returns profile object excluding password hash.

---

## 3. Product Catalog & Listings (`/api/products`)

### 3.1 Search & Filter Products
- **Route:** `GET /api/products`
- **Auth:** Public
- **Query Parameters:**
  - `search` (string): Text search across title and description.
  - `category` (string): Category ID or slug.
  - `minPrice` (number): Minimum daily rate.
  - `maxPrice` (number): Maximum daily rate.
  - `condition` (string): Filter by condition (comma-separated).
  - `location` (string): City or pickup area.
  - `sort` (string): `price_asc`, `price_desc`, `rating`, `newest`.
  - `page` (number): Page number (default `1`).
  - `limit` (number): Results per page (default `12`).
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "6adde478de5e4baf4185ec31",
        "name": "ngyug",
        "slug": "ngyug-1729864200",
        "description": "High performance gear for testing",
        "pricePerDay": 500,
        "securityDeposit": 1000,
        "condition": "Like New",
        "location": "Chennai",
        "images": ["https://res.cloudinary.com/.../product.jpg"],
        "category": { "_id": "6ac287338e801e85e6811401", "name": "Vehicles", "slug": "vehicles" }
      }
    ],
    "pagination": { "page": 1, "limit": 12, "total": 31, "totalPages": 3 }
  }
  ```

### 3.2 Get Product Details
- **Route:** `GET /api/products/:id`
- **Auth:** Public
- **Response (`200 OK`):** Full product details with populated owner profile and category.

### 3.3 Check Product Date Availability
- **Route:** `GET /api/products/:id/availability?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- **Auth:** Public
- **Response (`200 OK`):** `{ "success": true, "data": { "available": true } }`

### 3.4 Get Current Owner Products
- **Route:** `GET /api/products/my-products`
- **Auth:** Bearer Token (`owner`, `admin`, `super_admin`)
- **Response (`200 OK`):** List of products owned by the authenticated owner.

### 3.5 Create New Product
- **Route:** `POST /api/products`
- **Auth:** Bearer Token (`owner`)
- **Request Body:**
  ```json
  {
    "name": "Sony FE 24-70mm f/2.8 GM",
    "description": "Professional zoom lens in pristine condition.",
    "category": "6ac287338e801e85e6811402",
    "pricePerDay": 1200,
    "securityDeposit": 8000,
    "condition": "Like New",
    "location": "Bengaluru",
    "images": ["https://res.cloudinary.com/.../lens.jpg"]
  }
  ```
- **Response (`201 Created`):** Returns newly created product document.

### 3.6 Update Product Details
- **Route:** `PATCH /api/products/:id`
- **Auth:** Bearer Token (`owner` of the product, or `admin`)
- **Request Body:** Partial product fields (`pricePerDay`, `description`, `status`, etc.).
- **Response (`200 OK`):** Returns updated product document.
- **Errors:** `401 Unauthorized` / `403 Forbidden` if another user attempts to edit.

### 3.7 Delete Product Listing
- **Route:** `DELETE /api/products/:id`
- **Auth:** Bearer Token (`owner` of the product, or `admin`)
- **Response (`200 OK`):** `{ "success": true, "message": "Product removed successfully" }`

---

## 4. Bookings & Reservation Engine (`/api/bookings`)

### 4.1 Create Booking Request
- **Route:** `POST /api/bookings`
- **Auth:** Bearer Token (`borrower`, `admin`)
- **Request Body:**
  ```json
  {
    "product": "6adde478de5e4baf4185ec31",
    "startDate": "2026-12-24",
    "endDate": "2026-12-27"
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "6ade2b2df066e21ff80b4612",
      "bookingId": "BKG-941831-337",
      "duration": 3,
      "rentalAmount": 1500,
      "securityDeposit": 1000,
      "platformFee": 150,
      "totalAmount": 2650,
      "status": "PENDING",
      "paymentStatus": "PENDING"
    }
  }
  ```
- **Errors:** `400 Bad Request` ("Product is already booked for the selected dates").

### 4.2 Get Borrower Bookings
- **Route:** `GET /api/bookings/my-bookings`
- **Auth:** Bearer Token (`borrower`)
- **Response (`200 OK`):** Array of bookings requested by authenticated borrower.

### 4.3 Get Owner Booking Requests
- **Route:** `GET /api/bookings/owner/requests`
- **Auth:** Bearer Token (`owner`)
- **Response (`200 OK`):** Array of booking requests submitted for the owner's equipment.

### 4.4 Accept or Reject Booking
- **Route:** `PATCH /api/bookings/:id/status`
- **Auth:** Bearer Token (`owner` of item or `admin`)
- **Request Body:** `{ "action": "accept" }` or `{ "action": "reject" }`
- **Response (`200 OK`):** Updated booking with status `CONFIRMED` or `REJECTED`.

---

## 5. Payments & Financial Transactions (`/api/payments`)

### 5.1 Create Gateway Order (Razorpay)
- **Route:** `POST /api/payments/create-order`
- **Auth:** Bearer Token
- **Request Body:** `{ "bookingId": "6ade2b2df066e21ff80b4612" }`
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "orderId": "order_M4v82N302Lksj",
      "amount": 265000,
      "currency": "INR",
      "key": "rzp_test_..."
    }
  }
  ```

### 5.2 Simulate Payment (Academic Demo Flow)
- **Route:** `POST /api/payments/simulate`
- **Auth:** Bearer Token
- **Request Body:**
  ```json
  {
    "bookingId": "6ade2b2df066e21ff80b4612",
    "amount": 2650,
    "simulationStatus": "success"
  }
  ```
  *(Pass `"simulationStatus": "failed"` to demonstrate payment declination)*.
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Payment simulation successful",
    "data": {
      "paymentId": "6ade2b2df066e21ff80b4614",
      "bookingId": "6ade2b2df066e21ff80b4612",
      "status": "SUCCESS"
    }
  }
  ```
- **Database Effects:**
  1. Creates `Payment` document with `status: 'SUCCESS'`.
  2. Updates `Booking` document: `paymentStatus: 'PAID'`, `status: 'ACTIVE'` / `'CONFIRMED'`.
  3. Creates `Rental` record for active physical possession tracking.

---

## 6. Physical Possession & Rentals (`/api/rentals`)

### 6.1 Get Active Rentals
- **Route:** `GET /api/rentals/active`
- **Auth:** Bearer Token
- **Response (`200 OK`):** Array of currently active rental handovers for the user.

### 6.2 Request Return Inspection
- **Route:** `PATCH /api/rentals/:id/return`
- **Auth:** Bearer Token (`borrower`)
- **Response (`200 OK`):** Updates rental status to `RETURN_REQUESTED` and sets `returnRequestedAt`.

### 6.3 Confirm Gear Return & Complete Rental
- **Route:** `PATCH /api/rentals/:id/complete`
- **Auth:** Bearer Token (`owner` or `admin`)
- **Response (`200 OK`):** Updates rental status to `COMPLETED` and booking status to `COMPLETED`.

---

## 7. Dispute Resolution (`/api/disputes`)

### 7.1 Open Dispute Case
- **Route:** `POST /api/disputes`
- **Auth:** Bearer Token (`borrower` or `owner` involved in the booking)
- **Request Body:**
  ```json
  {
    "bookingId": "6ade2b2df066e21ff80b4612",
    "reason": "Item Damaged during Rental",
    "description": "Camera sensor was scratched upon return. Repair estimate is ₹4,200.",
    "evidenceUrls": ["https://res.cloudinary.com/.../scratch.jpg"]
  }
  ```
- **Response (`201 Created`):** Dispute record initialized with status `OPENED`.

### 7.2 List User Disputes
- **Route:** `GET /api/disputes`
- **Auth:** Bearer Token
- **Response (`200 OK`):** List of disputes where user is claimant or respondent (or all if admin).

### 7.3 Resolve Dispute (Admin)
- **Route:** `PATCH /api/disputes/:id/resolve`
- **Auth:** Bearer Token (`admin`, `super_admin`)
- **Request Body:**
  ```json
  {
    "action": "DEDUCT_DEPOSIT",
    "amount": 4200,
    "reason": "Verified camera sensor scratch via repair invoice."
  }
  ```
- **Response (`200 OK`):** Dispute updated to `RESOLVED` with recorded resolution settlement.

---

## 8. Owner Analytics (`/api/owner`)

### 8.1 Get Owner Statistics
- **Route:** `GET /api/owner/stats`
- **Auth:** Bearer Token (`owner`, `admin`)
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": {
      "myProducts": 3,
      "pendingRequests": 0,
      "activeRentals": 0,
      "completedRentals": 0,
      "totalEarnings": 0
    }
  }
  ```

---

## 9. Administrator APIs (`/api/admin`)

- `GET /api/admin/stats` — Overall marketplace KPIs (Total Users, Products, Bookings, Active Rentals).
- `GET /api/admin/users` — User directory with filtering and suspension controls.
- `PATCH /api/admin/users/:id/suspend` — Suspends user account and logs audit trail.
- `PATCH /api/admin/users/:id/activate` — Re-activates suspended user.
- `GET /api/admin/marketplace/bookings` — System-wide booking ledger.
- `POST /api/categories` — Create category taxonomy entry.
- `PATCH /api/categories/:id` — Update category.
- `DELETE /api/categories/:id` — Delete category.
- `GET /api/admin/trust/audit-logs` — Compliance log query.

---

## 10. Media Uploads (`/api/uploads`)

### 10.1 Upload Media Assets
- **Route:** `POST /api/uploads/images`
- **Auth:** Bearer Token
- **Content-Type:** `multipart/form-data` (Field: `files`, max 5 files)
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "data": [
      "https://res.cloudinary.com/rwq0w94c/image/upload/v179284920/rentable/asset_1.jpg"
    ]
  }
  ```
