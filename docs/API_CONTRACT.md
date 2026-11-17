# RENTABLE API CONTRACT & MIGRATION STRATEGY

This document tracks the specific frontend hooks that need to be migrated from their current Mock/Fallback state to the actual NestJS endpoints.

## 1. Authentication (`useAuth`)
| Feature | Method | Endpoint | Status | Backend Controller | Action Required |
|---------|--------|----------|--------|--------------------|-----------------|
| Login | POST | `/api/auth/login` | PARTIAL | `AuthController` | Need to securely persist JWT returned by backend into an HTTP-only cookie to satisfy Next.js Middleware route guards. |
| Register | POST | `/api/auth/register` | PARTIAL | `AuthController` | Same as Login. |

## 2. Public Catalog (`useProducts`)
| Feature | Method | Endpoint | Status | Backend Controller | Action Required |
|---------|--------|----------|--------|--------------------|-----------------|
| Search/Filter | GET | `/api/products` | MOCK | `ProductsController` | Remove `MOCK_PRODUCTS` fallback in `useProducts.ts`. Fetch real data from MongoDB, map the schema, and update `ExploreClient.tsx` to handle the real `Product` schema. |
| Product Details | GET | `/api/products/:id` | MOCK | `ProductsController` | Same as above. Connect `ProductDetailClient.tsx` to the real endpoint. |

## 3. Booking Engine (`useBookings` / `usePayments`)
| Feature | Method | Endpoint | Status | Backend Controller | Action Required |
|---------|--------|----------|--------|--------------------|-----------------|
| Create Booking | POST | `/api/bookings` | DISCONNECTED | `BookingsController` | The checkout page currently uses fake IDs. Must post to this endpoint with `startDate`, `endDate`, `product`. |
| Create Payment | POST | `/api/payments/create-order` | DISCONNECTED | `PaymentsController` | Must call this immediately after booking creation to initialize Razorpay. |
| Verify Payment | POST | `/api/payments/verify` | DISCONNECTED | `PaymentsController` | After Razorpay modal success, post signature to backend for validation. |

## 4. Owner Dashboard (`useOwner`)
| Feature | Method | Endpoint | Status | Backend Controller | Action Required |
|---------|--------|----------|--------|--------------------|-----------------|
| Create Product | POST | `/api/products` | MOCK | `ProductsController` | Remove the mock barrier in `/owner/products/new`. Implement `react-hook-form` to submit multipart data (images + JSON) to the backend. |
| Dashboard Data | GET | `/api/owner/stats` | DISCONNECTED | `OwnerController` | Connect the static UI tables in the Owner Dashboard to the real aggregation endpoints. |

## 5. Admin Dashboard (`useAdmin`)
| Feature | Method | Endpoint | Status | Backend Controller | Action Required |
|---------|--------|----------|--------|--------------------|-----------------|
| Product Moderation | GET/PATCH | `/api/admin/products` | DISCONNECTED | `AdminController` | Wire up the `AdminProducts` page to fetch pending products and allow approval/rejection. |
| User Moderation | GET | `/api/admin/users` | DISCONNECTED | `AdminController` | Wire up the `AdminPeople` page to fetch the real user list. |

## Strategy for Migration (Phase 10)
We will execute Phase 10 route by route:
1. **Auth:** Fix the session persistence first. Without it, none of the other endpoints will authorize the user.
2. **Catalog:** Fix the public products GET endpoints. (Easy win).
3. **Owner:** Fix product creation so the DB has real supply.
4. **Checkout:** Build the real Razorpay transaction flow.
5. **Dashboards:** Connect the operations tables.
