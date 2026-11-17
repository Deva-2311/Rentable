# BACKEND IMPLEMENTATION PLAN

## 1. Current Backend Architecture
The backend is a robust NestJS application following domain-driven design principles. It leverages Mongoose for MongoDB data persistence. It incorporates standard enterprise patterns: global validation pipes, exception filters, JWT/bcrypt authentication, role-based access control guards, API throttling, Winston logging, and Swagger documentation.

## 2. Existing Modules
- **Core**: `DatabaseModule`, `HealthModule`, `CommonModule`, `AuthModule`, `UsersModule`
- **Catalog**: `ProductsModule`, `CategoriesModule`
- **Transactions**: `BookingsModule`, `PaymentsModule`
- **Operations**: `RentalsModule`, `ReviewsModule`, `NotificationsModule`, `WishlistModule`, `UploadsModule`
- **Dashboards**: `AdminModule`, `OwnerModule`

## 3. Existing Database Models
The Mongoose schemas map perfectly to the requested domain:
- `User` (Borrower, Owner, Admin roles)
- `Product` (Price, Condition, Availability, Status lifecycle)
- `Category`
- `Booking` (Requested -> Confirmed -> Completed)
- `Payment` (Razorpay integration)
- `Rental` (Physical lifecycle: Pickup -> Return)
- `Review`, `Wishlist`, `Notification`, `RefreshToken`

## 4. Existing APIs
Over 55 robust API endpoints are already exposed, fully covering authentication, product CRUD, owner operations, admin reporting, booking creation (with server-side overlapping validation), Razorpay order creation, and rental state transitions.

## 5. Broken APIs
- The backend logic itself is remarkably complete. However, `PaymentsController` and `BookingsController` expect Razorpay signatures and valid payment IDs that the frontend does not currently generate because the frontend checkout is mocked.
- Webhook endpoints for asynchronous payment processing are currently missing.

## 6. Missing APIs
- Razorpay Webhook endpoint (`/api/payments/webhook`) to handle async payment resolutions securely.
- Granular email dispatch service (currently mocked in `AuthService.verifyEmail`).

## 7. Frontend/Backend Mismatches (THE PRIMARY ISSUE)
- The frontend extensively uses a `MOCK_PRODUCTS` constant.
- The `useProducts` hook fails silently and defaults to mock data if the backend is not connected.
- The frontend `checkout` route manually generates fake booking IDs and ignores the `/api/bookings` and `/api/payments/create-order` endpoints entirely.
- The Admin and Owner dashboards have hardcoded UI tables rather than consuming `/api/admin/dashboard` or `/api/owner/dashboard`.

## 8. Missing Business Logic
- The backend contains nearly all required business logic (overlapping booking prevention, server-side pricing).
- Missing: Refund processing logic upon cancelled bookings or failed inspections.

## 9. Authentication Gaps
- **Backend:** Solid (JWT, bcrypt, Refresh tokens).
- **Frontend:** Does not securely persist the JWT in an `HttpOnly` cookie or localStorage in a way that aligns with Next.js Middleware. `apiClient.ts` uses localStorage but the App Router cannot read it during SSR.

## 10. Authorization Gaps
- **Backend:** `@Roles()` guards are properly enforced.
- **Frontend:** Missing route guards. A borrower can manually navigate to `/admin/dashboard`.

## 11. Booking Lifecycle Gaps
- **Backend:** State machine (PENDING -> CONFIRMED -> ACTIVE -> COMPLETED) is fully modeled.
- **Frontend:** Entirely disconnected. Borrowers cannot request, and Owners cannot accept.

## 12. Payment Gaps
- **Backend:** `createOrder` and `verifyPayment` exist.
- **Frontend:** Razorpay script is not loaded, and the checkout form does not initiate the real gateway.

## 13. Rental Lifecycle Gaps
- **Backend:** Fully modeled (pickup, active, return request, inspection).
- **Frontend:** UI buttons to trigger these API calls are missing or mocked.

## 14. Admin Gaps
- **Backend:** Robust aggregation endpoints exist.
- **Frontend:** Data tables are static mock placeholders.

## 15. Security Gaps
- **Backend:** Secure, but CORS must be tightly restricted in production. JWTs are passed via Bearer tokens (vulnerable to XSS on frontend if stored in localStorage).
- **Frontend:** Lacks CSRF protection and HTTP-only cookie session management.

## 16. Testing Gaps
- Comprehensive E2E testing using Jest/Supertest across the full booking/payment lifecycle is required to guarantee no regressions when integrating the frontend.

## 17. Exact Implementation Order

1. **PHASE 1: Foundation & Audit Completion**
   - Verify DB seeding, configuration, and health endpoints. Create `API_CONTRACT.md`.
2. **PHASE 2: Frontend Auth & Session Security**
   - Refactor Next.js frontend to securely handle JWTs and protect routes (Admin/Owner/Borrower).
3. **PHASE 3: Product Integration**
   - Remove `MOCK_PRODUCTS`. Connect `/explore` and `/products/[id]` to the real NestJS API.
4. **PHASE 4: Owner Uploads & Management**
   - Connect `/owner/products/new` to `/api/products` and `/api/uploads/images`.
5. **PHASE 5: Booking & Pricing Engine Integration**
   - Refactor frontend `/checkout` to consume server-calculated pricing and create real bookings.
6. **PHASE 6: Razorpay Payments**
   - Integrate Razorpay SDK on the frontend. Connect to `/api/payments/create-order` and `/verify`.
7. **PHASE 7: Dashboards & Rental Lifecycle**
   - Bind Owner and Admin data tables to the real NestJS aggregation endpoints.
8. **PHASE 8: Polish & E2E Testing**
   - Reviews, Wishlists, Notifications, and automated end-to-end testing of the complete flow.
