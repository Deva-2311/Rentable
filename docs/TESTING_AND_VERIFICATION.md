# RENTABLE — Testing, Quality Assurance & Verification Matrix
**Empirical Verification Evidence, Test Execution Logs, and Invariant Auditing**

---

## 1. Testing Strategy Overview

RENTABLE employs a multi-tiered quality assurance strategy to validate system stability, business invariant preservation, and security enforcement across both server and client architectures:

1. **Static Type Analysis & Production Builds:** Comprehensive TypeScript compilation checks in both NestJS and Next.js Turbopack engines to prevent runtime type errors.
2. **Automated Academic Flow Integration Test:** End-to-end integration test (`backend/scripts/test-academic-flow.js`) executing 14 continuous verification steps against the live database and REST API.
3. **HTTP Route & Redirect Verification:** Live network inspection using `curl` and client runtime requests verifying status codes and header redirects.
4. **Role-Based Access Control (RBAC) & Ownership Auditing:** Rigorous verification that owners cannot modify each other's equipment, unauthenticated visitors cannot access protected tabs, and borrowers cannot perform administrative interventions.

---

## 2. Comprehensive Test Verification Matrix

| Test ID | Test Scenario | Expected Result | Actual Result | Status | Verification Evidence / Log |
|---|---|---|---|---|---|
| **TM-001** | Backend Compilation | `nest build` compiles cleanly with zero TypeScript errors. | Exited with code `0`. Dist bundle created. | **PASS** | `npm --prefix backend run build` |
| **TM-002** | Frontend Production Build | `next build` compiles all App Router pages and generates static/dynamic routes. | Exited with code `0`. 43/43 routes generated successfully. | **PASS** | `npm --prefix frontend run build` |
| **TM-003** | Route `/owner` Resolution | Request to `/owner` returns HTTP 308 redirect to `/owner/dashboard`. | `HTTP/1.1 308 Permanent Redirect` with `Location: /owner/dashboard`. | **PASS** | `curl -I http://localhost:3000/owner` |
| **TM-004** | Route `/disputes` Resolution | Dispute Resolution Center renders with HTTP 200 without 404 error. | `HTTP/1.1 200 OK` (Content-Type: `text/html`). | **PASS** | `curl -I http://localhost:3000/disputes` |
| **TM-005** | Borrower Login | Valid credentials return JWT token and user profile. | HTTP 201; JWT token returned with role `'borrower'`. | **PASS** | Step 3 of `test-academic-flow.js` |
| **TM-006** | Product Catalog Query | `GET /api/products` returns active listings with populated category. | Retrieved 12 active products; populated category names. | **PASS** | Step 1 of `test-academic-flow.js` |
| **TM-007** | Booking Creation & Price Formula | Booking calculates duration, rental amount, 10% platform fee, and total. | Total: ₹2,650 (Rental: ₹1,500, Deposit: ₹1,000, Fee: ₹150). | **PASS** | Step 4 of `test-academic-flow.js` |
| **TM-008** | Overlapping Date Conflict | Attempting to book the same product on overlapping dates is rejected. | HTTP 400: *"Product is already booked for the selected dates."* | **PASS** | Step 5 of `test-academic-flow.js` |
| **TM-009** | Payment Simulation (Failure) | Triggering simulated failure rejects transaction and logs failure. | HTTP 400: *"Simulated payment failure (Demo mode)."* | **PASS** | Step 6 of `test-academic-flow.js` |
| **TM-010** | Payment Simulation (Success) | Triggering simulated success creates Payment and sets `PAID`. | HTTP 200: Payment record created; Booking status `ACTIVE`. | **PASS** | Step 7 of `test-academic-flow.js` |
| **TM-011** | Physical Rental Custody | Paid booking generates active physical custody record. | `Rental` record created with status `UPCOMING` / `ACTIVE`. | **PASS** | Step 10 of `test-academic-flow.js` |
| **TM-012** | Owner Dashboard Metrics | Querying `/owner/stats` returns accurate counts using BSON ObjectId match. | `myProducts: 3`, `totalEarnings`, `activeRentals` returned. | **PASS** | Verified via Node test script |
| **TM-013** | Owner Product Mutation | Owner updates listing price via `PATCH /products/:id`. | HTTP 200: Changes persisted to MongoDB; populated response. | **PASS** | Verified via Node test script |
| **TM-014** | Dispute Case Submission | User submits formal mediation claim with reason and evidence photos. | HTTP 201: Dispute saved with status `OPENED`. | **PASS** | Verified via Node test script |
| **TM-015** | Admin Governance KPIs | Admin retrieves marketplace aggregate stats. | HTTP 200: Users: 29, Products: 31, Bookings: 2, Active: 1. | **PASS** | Step 12 of `test-academic-flow.js` |
| **TM-016** | Cloudinary Image Upload | Multi-part form upload returns secure Cloudinary image URLs. | HTTP 200: Asset uploaded to Cloudinary folder with HTTPS URL. | **PASS** | Verified in `UploadsService` |
| **TM-017** | Backend Unit & Integration Tests | Jest executes all 33 test suites across services and controllers. | 33 passed, 33 total test suites; 37 passed, 37 total tests. | **PASS** | `npm --prefix backend test` |

---

## 3. How to Reproduce All Tests Locally

### Run Backend Unit & Module Test Suites:
```bash
npm --prefix backend test
```
*Expected Result:*
```
Test Suites: 33 passed, 33 total
Tests:       37 passed, 37 total
Snapshots:   0 total
Ran all test suites.
```

### Run Academic Flow Automated Integration Test:
```bash
node backend/scripts/test-academic-flow.js
```
*Expected Console Output:*
```
====================================================
   RENTABLE — ACADEMIC DEMO FLOW VERIFICATION       
====================================================
Step 1: Browsing available products...
✓ Retrieved 12 products from backend database.
...
====================================================
✓ ALL 14 STEPS OF THE DEMONSTRATION VERIFIED END-TO-END!
====================================================
```

### Run Full Production Compilations:
```bash
npm --prefix backend run build
npm --prefix frontend run build
```
Both commands must complete with exit code `0`.
