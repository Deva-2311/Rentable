# RENTABLE — Viva Voce, Examination & Presentation Guide
**Oral Examination Preparation, Technical Explanations, Demonstration Scripts & 35 Core Viva Questions with Model Answers**

---

## 1. Two-Minute Elevator Pitch

> *"Good morning respected examiners. My project is **RENTABLE — A Peer-to-Peer Product Rental Marketplace**.
> In modern urban economies, high-value physical equipment—such as DSLR cameras, drones, camping gear, and power tools—remains idle over 90% of the time, while prospective users are reluctant to buy expensive gear for short-term needs.
> RENTABLE solves this inefficiency by creating a secure, two-sided rental platform connecting product owners with borrowers.
> The application features strict Role-Based Access Control, automated calendar date-conflict prevention, a transparent escrow pricing model with refundable security deposits, interactive availability calendars, and a formal dispute resolution system.
> The system is architected as an enterprise-grade full-stack application utilizing **Next.js 16 (App Router)** with **TypeScript** and **Tailwind CSS** on the frontend, and **NestJS** with **MongoDB** and **Mongoose** on the backend, secured via **JWT** and **bcrypt**. It addresses the entire rental lifecycle from product discovery and reservation to return verification and review."*

---

## 2. Five-Minute Technical Explanation

1. **System Architecture:**
   RENTABLE follows a clean, layered client-server architecture. The frontend is a Next.js 16 React application utilizing Server and Client Components, optimized with TanStack Query for cache invalidation and state synchronization. The backend is a NestJS 11 monolithic REST API structured into decoupled domain modules (Auth, Products, Bookings, Rentals, Payments, Disputes, Admin).

2. **Persistence & Data Modeling:**
   Data is persisted in MongoDB across canonical collections (`users`, `products`, `categories`, `bookings`, `rentals`, `payments`, `disputes`, `auditlogs`). We utilize Mongoose schemas to enforce strict data validation, typed enumerations, and canonical `ObjectId` references. Related documents are populated selectively, minimizing storage redundancy.

3. **Concurrency & Date Overlap Invariant:**
   A critical technical challenge in rental marketplaces is preventing double-booking. When a borrower requests a date range $[S_{req}, E_{req}]$, the backend queries the `bookings` collection for any non-cancelled booking on that product where $(S_{exist} \le E_{req}) \land (E_{exist} \ge S_{req})$. If an overlap is detected, the request is immediately rejected with HTTP 400.

4. **Security & Financial Lifecycle:**
   Authentication utilizes Passport JWT with signed access tokens and salted bcrypt password hashing. Authorization is enforced using NestJS Execution Guards (`JwtAuthGuard`, `RolesGuard`) and custom decorators (`@Roles`). Financial integrity is maintained by holding security deposits in trust and calculating platform fees dynamically ($10\%$ of rental duration subtotal).

---

## 3. Ten-Minute Live Demonstration Script

| Time | Action | Screen / Endpoint | Key Feature to Highlight |
|---|---|---|---|
| **0:00 - 1:30** | Marketplace Exploration | `/` and `/explore` | Dynamic product cards, category taxonomy filtering, and price search. |
| **1:30 - 3:00** | Product Details & Booking | `/products/[id]` | Real-time date selection, automatic duration calculation, transparent pricing breakdown (Rate, Deposit, 10% Fee). |
| **3:00 - 4:30** | Conflict Prevention Demo | `/products/[id]` | Demonstrate selecting conflicting dates; observe server rejection preventing double-booking. |
| **4:30 - 6:00** | Checkout & Payment Simulation | `/checkout/[id]` | Demonstrate the dual payment engine: test failure mode (transaction declined), then success mode. |
| **6:00 - 7:30** | Borrower Dashboard & Rental | `/borrower/rentals` | Show active rental handover custody and the "Request Return" flow. |
| **7:30 - 9:00** | Owner Dashboard & Fleet Calendar | `/owner/dashboard` & `/owner/calendar` | 4-card live Bento metrics, month availability calendar with booking chips, and transaction ledger. |
| **9:00 - 10:00** | Admin Moderation & Audit Trail | `/admin/dashboard` & `/admin/trust` | User directory, user suspension with reason, and immutable audit logs. |

---

## 4. 35 Core Viva Questions with Model Answers

### Category A: Architecture & Tech Stack

#### Q1. Why did you choose NestJS over raw Express.js for the backend?
**Answer:** While Express is minimal and unopinionated, it lacks architectural structure for scaling. NestJS provides an out-of-the-box modular architecture inspired by Angular, utilizing Controllers, Providers, Dependency Injection, and TypeScript decorators. This ensures strict separation of concerns, built-in exception filters, class-validator pipes, and native support for guards and interceptors.

#### Q2. What is the role of Next.js App Router in RENTABLE?
**Answer:** Next.js App Router organizes the application around directory-based routing with support for nested layouts, Server Components, and Client Components. It enables optimized server-side rendering, instant client-side transitions via TanStack Query, and built-in redirects (such as routing `/owner` to `/owner/dashboard`).

#### Q3. What is the difference between Server Components and Client Components in Next.js?
**Answer:** Server Components execute and render on the server, producing static HTML with zero client JavaScript bundle impact. Client Components (declared with `"use client"`) execute in the browser and enable interactive state, event handlers (`onClick`, `onChange`), and browser hooks (`useState`, `useEffect`).

---

### Category B: Database & MongoDB Modeling

#### Q4. Why choose MongoDB over a Relational Database like PostgreSQL?
**Answer:** Rental marketplaces feature heterogeneous product catalogs where different categories (e.g., vehicles vs cameras vs camping gear) have varying attributes and metadata. MongoDB's document model allows flexible schema evolution while Mongoose provides schema validation. Additionally, MongoDB handles high read volume efficiently with BSON document indexing.

#### Q5. How does RENTABLE maintain referential integrity without SQL foreign-key constraints?
**Answer:** Referential integrity is enforced at the application/service layer. Mongoose schemas reference target collections using `MongooseSchema.Types.ObjectId` with `ref: '<Model>'`. Controllers validate that referenced entities exist before writing records. For critical workflows, compound query filters ensure parent-child consistency.

#### Q6. What is the difference between Document Embedding and Document Referencing?
**Answer:** Embedding places subdocuments inside a parent document (used in RENTABLE for Dispute Resolutions `{ action, amount, reason }`). Referencing stores ObjectIds pointing to external collections (used for Bookings referencing Users and Products) to avoid duplicate storage and maintain a single source of truth.

#### Q7. Why did you use `findByIdAndUpdate` instead of `.save()` on populated documents?
**Answer:** When Mongoose populates a document (e.g. `product.owner`), the field changes from an `ObjectId` string to a full JavaScript object `{ _id, fullName }`. Calling `.save()` re-validates the entire document against the schema, which can fail if the schema expects an `ObjectId` or string. `findByIdAndUpdate` performs an atomic `$set` mutation directly in MongoDB without populated schema validation errors.

---

### Category C: Authentication, Security & RBAC

#### Q8. Explain how JWT Authentication is implemented in RENTABLE.
**Answer:** When a user logs in via `/api/auth/login`, bcrypt verifies the plaintext password against the stored salt hash. If valid, the server signs a JWT containing the user's ID (`sub`) and `role` with an HMAC-SHA256 secret key. The client stores this token and sends it in the `Authorization: Bearer <token>` header for subsequent requests. Passport JWT extracts and verifies the token on protected routes.

#### Q9. How do you distinguish Authentication from Authorization?
**Answer:** Authentication confirms **who the user is** (handled by `JwtAuthGuard` verifying the token). Authorization determines **what the user is permitted to do** (handled by `RolesGuard` checking if the user's role satisfies the `@Roles()` decorator requirements on that endpoint).

#### Q10. What prevents an owner from editing or deleting another owner's product?
**Answer:** In `ProductsService.update` and `remove`, the service compares the product's owner ID (`product.owner`) against the authenticated user ID (`req.user._id`). If they do not match (and the user is not an administrator), the backend throws an HTTP `401 Unauthorized` / `403 Forbidden` exception.

#### Q11. How are passwords stored securely?
**Answer:** Passwords are never stored in plaintext. They are hashed using **bcrypt** with 10 salt rounds before persistence. In `user.schema.ts`, the field is marked `{ select: false }` so password hashes are excluded from database queries by default.

#### Q12. What happens when an administrator suspends a user?
**Answer:** The administrator triggers `PATCH /api/admin/users/:id/suspend`. The backend sets `isActive: false` and logs the event in the `AuditLog` collection. During login or authentication checks, any user with `isActive === false` is rejected with HTTP 401.

---

### Category D: Rental Business Logic & Date Concurrency

#### Q13. How does the system prevent double-booking on overlapping dates?
**Answer:** In `BookingsService.checkAvailability()`, the system queries existing bookings for that product where:
`startDate <= requestedEndDate AND endDate >= requestedStartDate` and `status` is not `CANCELLED` or `REJECTED`. If any document matches, the backend rejects the request with HTTP 400.

#### Q14. What is the pricing formula used in RENTABLE?
**Answer:**
1. **Duration:** $\text{duration} = \lceil (endDate - startDate) \rceil$ (in days, minimum 1).
2. **Rental Amount:** $rentalAmount = pricePerDay \times duration$.
3. **Platform Fee:** $platformFee = 10\% \text{ of } rentalAmount$.
4. **Security Deposit:** Fixed refundable deposit snapshot from the product.
5. **Total Payable:** $totalAmount = rentalAmount + securityDeposit + platformFee$.

#### Q15. Why is the Security Deposit kept separate from the Rental Amount?
**Answer:** The rental amount is earned revenue paid to the equipment owner (minus platform fees), whereas the security deposit is an escrow safeguard held in trust and refunded in full upon satisfactory equipment return inspection.

#### Q16. What is the currency convention between Bookings and Payments?
**Answer:** Booking records and user interfaces display and store currency in **Indian Rupees (INR)**. Payment records store the amount in the smallest currency unit—**Paise** ($1 \text{ Rupee} = 100 \text{ Paise}$)—to conform to payment gateway standards (Razorpay/Stripe) and prevent floating-point rounding errors.

---

### Category E: Payments & Simulation

#### Q17. How does the Payment Simulation work?
**Answer:** For academic demonstrations and testing without live banking credentials, `POST /api/payments/simulate` accepts a `bookingId` and `simulationStatus` (`'success'` or `'failed'`). In success mode, it generates a valid `Payment` record, marks the booking as `PAID`, sets booking status to `ACTIVE`, and generates a `Rental` fulfillment document. In failure mode, it records the failure and returns an error without modifying booking status.

#### Q18. Does the codebase support real payment gateways?
**Answer:** Yes. The backend includes the official `razorpay` Node.js SDK and order creation endpoint (`/api/payments/create-order`) and signature verification (`/api/payments/verify`), allowing immediate production deployment when live gateway credentials are provided.

---

### Category F: Disputes & Governance

#### Q19. How does the Dispute Resolution system function?
**Answer:** If equipment is returned damaged, late, or missing accessories, either party can open a case via `/disputes`. They provide a category, factual description, and upload photographic evidence via Cloudinary. The case status advances from `OPENED` to `UNDER_REVIEW`. An administrator reviews the claim and issues a settlement (`REFUND_BORROWER`, `DEDUCT_DEPOSIT`, or `RELEASE_OWNER_PAYMENT`).

#### Q20. What is recorded in the Audit Log collection?
**Answer:** Every administrative action (suspending a user, activating an account, deleting a listing, resolving a dispute) creates an immutable `AuditLog` entry storing the `adminId`, `adminRole`, `action`, `targetType`, `targetId`, `previousState`, `newState`, `reason`, and `ipAddress`.
