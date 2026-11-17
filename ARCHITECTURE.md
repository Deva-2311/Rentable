# RENTABLE Platform Architecture

This document defines the concrete implementation architecture for the RENTABLE application based on the actual findings from the design discovery phase and the existing repository state.

## A. Proposed Folder Structure

### Frontend (`frontend/`)
The frontend is built with Next.js (App Router), React 19, Tailwind CSS v4, and TypeScript.
```text
frontend/src/
├── app/                    # Next.js App Router (Route Groups)
│   ├── (auth)/             # Authentication routes (login, signup, forgot-password)
│   ├── (public)/           # Public marketplace routes (home, explore, categories, products)
│   ├── borrower/           # Borrower dashboard and rentals management
│   ├── owner/              # Owner dashboard, products, calendar, and earnings
│   ├── admin/              # Admin operations center
│   └── checkout/           # Escrow review and booking confirmation
├── components/             # Reusable UI Architecture
│   ├── admin/              # Admin-specific layouts (AdminSidebar, AdminHeader, DataTable)
│   ├── layout/             # Global shell (Header, Footer, Navigation)
│   ├── marketplace/        # Public shared components (ProductCard, CategoryBento)
│   ├── forms/              # Reusable react-hook-form/zod wrappers
│   └── ui/                 # shadcn/ui primitives and Base UI
├── features/               # Domain-Driven Design Modules
│   ├── auth/               # Auth API, contexts, and domain components
│   ├── bookings/           # Booking requests, scheduling, and escrow logic
│   ├── products/           # Asset catalog, condition ledger, specs
│   ├── rentals/            # Active custody management
│   ├── reviews/            # Production audits and feedback
│   └── users/              # Profiles and trust/safety dossiers
├── hooks/                  # Global custom React hooks
├── lib/                    # Core utilities and configs
│   ├── api/                # Axios client configurations and interceptors
│   ├── auth/               # AuthContext singleton
│   └── utils.ts            # Tailwind `cn` merger and generic formatters
├── store/                  # Redux Toolkit Global State
│   └── slices/             # Redux slices (e.g., multi-step checkout state)
└── types/                  # Global TypeScript interfaces matching Backend DTOs
```

### Backend (`backend/`)
The backend is built with NestJS 11, Mongoose (MongoDB), and Socket.IO.
```text
backend/src/
├── common/                 # Guards, interceptors, decorators, and global filters
├── config/                 # Environment and module configurations
├── database/               # Mongoose schema definitions and seeders
├── modules/                # Core Business Logic (Modules, Controllers, Services)
│   ├── admin/              # Platform moderation and oversight
│   ├── auth/               # JWT authentication and RBAC
│   ├── bookings/           # Reservation and custody request workflows
│   ├── categories/         # Equipment category taxonomy
│   ├── disputes/           # Return anomaly and damage escrow arbitration
│   ├── payments/           # Razorpay integration and ledger operations
│   ├── products/           # Asset registry and availability tracking
│   ├── reviews/            # Trust & safety feedback ledgers
│   ├── users/              # Identity verification and biometric states
│   └── wishlist/           # User saved assets
└── main.ts                 # Application bootstrap
```

## B. Route Structure (App Router)

The routing uses Route Groups to isolate shared layouts and middleware authorization.

### 1. Public Routes `(public)`
- `/` - Home Landing Page
- `/explore` - Explore / Search Assets
- `/categories/[category]` - Category Listings
- `/products/[id]` - Product Details (Spatial Showcase & Escrow calc)
- `/profile/[id]` - Public Profile Dossier
- `/about` - About / Curation Standards
- `/404` - Not Found Error State

### 2. Auth Routes `(auth)`
- `/login` - Log In (JWT generation)
- `/signup` - Account Creation
- `/forgot-password` - Password Recovery

### 3. Borrower Routes `/borrower` (Auth Required: Role `borrower`)
- `/borrower/dashboard` - Dashboard Overview
- `/borrower/rentals/[id]` - Active Rental Details
- `/borrower/wishlist` - Saved Production Wishlist
- `/checkout` - Review Reservation & Escrow Hold
- `/booking/[id]/confirmation` - Digital Custody Pass

### 4. Owner Routes `/owner` (Auth Required: Role `owner`)
- `/owner/dashboard` - Business Overview
- `/owner/products` - Manage Vault Listings
- `/owner/products/new` - Add/Edit Product
- `/owner/bookings` - Custody Requests (Approve/Reject)
- `/owner/calendar` - Availability Management
- `/owner/earnings` - Financial Yields & Ledgers

### 5. Admin Routes `/admin` (Auth Required: Role `admin`)
- `/admin/dashboard` - Operations Overview
- `/admin/marketplace/products` - Catalog Moderation
- `/admin/marketplace/categories` - Category Management
- `/admin/marketplace/bookings` - Booking Oversight
- `/admin/people` - User Management & Identity
- `/admin/finance` - Payment & Refund Ops
- `/admin/trust` - Arbitration & Safety
- `/admin/trust/reviews` - Reputation Feedback
- `/admin/analytics` - Platform Metrics
- `/admin/settings` - System Configuration

### 6. Utility Routes
- `/messages` - Real-time Socket.io chat (Borrower ↔ Owner)

## C. Component Architecture

### 1. Shared Layouts
- **Global Layout (`app/layout.tsx`)**: Integrates Redux `StoreProvider`, TanStack `QueryProvider`, and `AuthContext`.
- **Admin Shell (`app/admin/layout.tsx`)**: Specialized viewport with `AdminSidebar` (using Base UI drawers) and `AdminHeader`.
- **Dashboards (`app/borrower/layout.tsx`, `app/owner/layout.tsx`)**: Inject horizontal navigational sub-headers beneath the global header.

### 2. UI Primitives (`components/ui`)
Powered by `shadcn` and Radix/Base UI components (accessible dialogs, select dropdowns, form wrappers).

### 3. State-Driven Components (`features/[domain]`)
Components tied directly to TanStack query hooks or Redux slices. For example, `CheckoutCalculator` reads local form state and Redux multi-step state, whereas `ProductCard` is a pure presentational component residing in `components/marketplace`.

## D. API Architecture

### Frontend Integration
- **Client (`lib/api/client.ts`)**: Base Axios instance handling HTTP requests. Contains interceptors to inject JWT tokens and handle 401 Unauthorized responses by dispatching logout.
- **Data Fetching (TanStack Query v5)**: Domain hooks wrap Axios calls.
  - *Queries*: Fetches (e.g., `useProducts(filters)`, `useBookingDetails(id)`)
  - *Mutations*: Updates (e.g., `useCreateBooking()`, `useUpdateProduct()`)
- **Query Key Factories**: Strongly typed query keys (e.g., `['products', 'list', filters]`) to ensure accurate cache invalidation after mutations.

### Backend Contracts
- **Controllers**: Handle incoming HTTP requests and validate DTOs using `class-validator`.
- **Services**: Contain pure business logic and interact with Mongoose models.
- **Guards (`JwtAuthGuard`, `RolesGuard`)**: Ensure strict RBAC (Role-Based Access Control) across endpoints.

## E. State Architecture

### 1. Server State (TanStack Query)
- **Scope**: All asynchronous data originating from the NestJS backend (Products, Bookings, Users, Earnings).
- **Behavior**: Handled strictly by React Query to manage caching, refetching on window focus, and pagination states without bloating global stores.

### 2. Client/Global UI State (Redux Toolkit)
- **Scope**: Complex, ephemeral UI states that transcend individual components but don't belong in the database.
- **Usage**: Multi-step forms (e.g., Product creation wizard, Checkout escrow flow), global modal managers, and complex client-side filter aggregations.

### 3. Singleton State (React Context)
- **Scope**: Immutable or rarely-changing global dependencies.
- **Usage**: `AuthContext` (initial user hydration and JWT token state) and WebSocket connections (Socket.IO client instance for `/messages`).

### 4. Local State (React `useState` / Form State)
- **Scope**: Component-specific interactivity.
- **Usage**: Form inputs (managed by `react-hook-form`), local toggles (accordion, tabs), and image carousel indices.

## F. Implementation Order

1. **Phase 1: Foundation (COMPLETED)**
   - Design System (Tokens, Typography, Tailwind Config)
   - Application Shells (Navbars, Footers, Admin Sidebar)
   - Core Shared Components (ProductCard, StatusBadge)
2. **Phase 2: Public Marketplace (COMPLETED)**
   - Home (`/`), Explore (`/explore`), Category Listings (`/categories/[category]`), Product Details (`/products/[id]`).
3. **Phase 3: Authentication & Authorization**
   - JWT integration, Log In, Sign Up, Forgot Password flows.
   - Route Guards via Next.js Middleware.
4. **Phase 4: Borrower Experience**
   - Borrower Dashboard, Active Rentals, Wishlist.
   - Escrow Checkout & Digital Custody Pass.
5. **Phase 5: Owner Experience**
   - Owner Dashboard, Products Management, Calendar.
   - Booking Request Approvals & Financial Earnings.
6. **Phase 6: Admin Operations**
   - Admin Dashboard, User Moderation, Trust & Safety Arbitrations.
7. **Phase 7: Utilities & Polish**
   - Messages (Socket.IO), 404 Pages, Empty States, Skeleton Loaders.
8. **Phase 8: API Data Binding**
   - Connect all static UI components directly to NestJS endpoints using TanStack Query.
9. **Phase 9: Quality Assurance**
   - End-to-End flow testing and mobile responsiveness audits.
