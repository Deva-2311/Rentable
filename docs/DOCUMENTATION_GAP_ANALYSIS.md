# RENTABLE — System Feature Audit & Documentation Gap Analysis
**Strict Verification Audit of Implemented, Partially Implemented, Simulated, and Planned Features**

---

## 1. Audit Principles & Classification Framework

In accordance with rigorous academic and software engineering evaluation standards, every feature in RENTABLE is classified into one of four verified categories:

1. **Fully Implemented & Verified:** The feature has active UI controls, verified API endpoints, persistent database mutations, and passes automated verification.
2. **Partially Implemented:** The schema, API, or UI exists, but certain edge cases or subsidiary workflows require manual steps or further integration.
3. **Simulated (Demo Mode):** The workflow is functionally modeled for demonstration purposes without executing external real-world actions (e.g., simulated payment gateways).
4. **Planned / Future Scope:** Architectural concepts referenced in discussions or schemas that are not yet wired into the user experience.

---

## 2. Feature Implementation Status Matrix

| Module / Domain | Status | Implemented Functionality (Verified) | Simulated or Partial Aspects | Planned Future Scope |
|---|---|---|---|---|
| **Authentication & RBAC** | **Fully Implemented** | User registration, login, JWT token issuance, Passport strategy, Bcrypt hashing, `@Roles` guard, active account checks. | None. Fully functional. | OAuth2 (Google / GitHub login). |
| **Product Catalog** | **Fully Implemented** | Full-text search, category filtering, price range queries, condition filters, pagination, product details. | None. | AI-based recommendation engine. |
| **Owner Fleet Management** | **Fully Implemented** | Add new listing, edit existing listings, pause/activate toggle, delete with confirmation, Cloudinary multi-image upload. | None. Fully functional. | Automated barcode / QR equipment tags. |
| **Owner Calendar** | **Fully Implemented** | Month calendar grid, product filter dropdown, booking chips, day popups, booking detail modals. | None. Fully functional. | External calendar sync (iCal / Google Calendar). |
| **Owner Earnings** | **Fully Implemented** | Real-time earnings aggregation from paid bookings, CSV ledger export, payout request modal. | Payout modal records the withdrawal request with a confirmation message rather than initiating an actual automated bank transfer via an API. | Direct banking webhook integrations (Razorpay Route / Cashfree). |
| **Booking Engine** | **Fully Implemented** | Date selection, duration calculation, pricing formula, double-booking overlap prevention. | None. Fully functional. | Multi-item basket bookings. |
| **Payment Engine** | **Simulated & SDK Ready** | Dual engine: `POST /payments/simulate` models success/failure and updates records. Official Razorpay SDK installed with order generation. | Payment simulation is used for demo without real debit/credit card charges. | Live production gateway webhook validation. |
| **Rental Tracking** | **Fully Implemented** | Physical custody record creation upon payment, "Request Return" flow, owner return confirmation. | None. Fully functional. | GPS asset tracking integration. |
| **Reviews & Ratings** | **Fully Implemented** | Authenticated review submission, 1-5 star ratings, unique index preventing duplicate reviews per booking. | None. Fully functional. | Review photo attachments. |
| **Dispute Resolution** | **Fully Implemented** | Dispute filing modal, evidence upload, case tracking, status badges, admin resolution settlement API. | None. Fully functional. | Formal third-party legal arbitration export. |
| **Administration** | **Fully Implemented** | Marketplace KPI dashboard, user suspension with reason, category management CRUD, booking ledger, audit logs. | None. Fully functional. | Automated fraud anomaly detection. |

---

## 3. Discovered Gaps & Recommended Remediation

### Gap 1: Automated Payment Webhooks
- **Observation:** Currently, payment simulation directly triggers status updates to `PAID` and `ACTIVE`. In live Razorpay mode, order creation is implemented, but handling real bank callbacks requires an externally accessible public webhook URL.
- **Recommendation:** Implement a signed Razorpay webhook handler (`/api/payments/webhook`) using HMAC-SHA256 signature verification for production deployments.

### Gap 2: Email & SMS Notifications
- **Observation:** `Notification` schema exists in the backend, but external SMTP/SMS dispatch (e.g. via SendGrid or Twilio) is not configured in the local development environment.
- **Recommendation:** Connect an asynchronous queue (e.g. BullMQ / Redis) with Nodemailer to dispatch confirmation emails on booking and return events.

### Gap 3: Identity Document Verification
- **Observation:** The `User` schema contains `verificationStatus` (`'PENDING'`, `'VERIFIED'`), but currently relies on administrative manual updates.
- **Recommendation:** Integrate automated Aadhaar/Govt ID verification via an OCR API for production borrower screening.
