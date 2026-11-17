# CRITICAL ISSUES

This document lists ONLY the actual, concrete blockers preventing the RENTABLE platform from functioning as a true end-to-end production system.

| Issue | Location | Impact | Required Fix | Priority |
|-------|----------|--------|--------------|----------|
| **Disconnected Checkout Flow** | `src/app/checkout/page.tsx` | Borrowers cannot actually book or pay for items. The flow fakes a booking ID and payment capture. | Implement `useCreateBooking` and integrate with backend `/payments/create-order` + `/payments/verify` using real Razorpay checkout. | CRITICAL |
| **Disconnected Product Creation** | `src/app/owner/products/new/page.tsx` | Owners cannot list real products. The UI has a hardcoded barrier stating it is a mock interface. | Integrate `react-hook-form` with the `useCreateProduct` hook to send multipart form data (with images) to the backend. | CRITICAL |
| **Mocked Admin & Owner Dashboards** | `src/app/admin/people/page.tsx`, `src/app/owner/dashboard/page.tsx` | Administrators cannot manage users, owners cannot manage their actual business state beyond static placeholders. | Connect Admin routes to `/admin/*` backend APIs, connect Owner dashboard to `/owner/stats` and map the data tables correctly. | HIGH |
| **Silent API Fallbacks** | `ExploreClient.tsx`, `ProductDetailClient.tsx` | The frontend gracefully falls back to `MOCK_PRODUCTS` if the backend is down, masking system failures from the user but providing fake data. | Improve error handling boundaries to show real fallback UI when backend is unreachable, reserving `MOCK_PRODUCTS` purely for a "demo mode". | MEDIUM |
| **Authentication Form Data Disconnect** | `src/app/(auth)/*` | Login/Signup uses `apiClient` but lack robust JWT session handling integrated with Next.js middleware. | Verify token persistence (cookies/localStorage) and ensure `AuthContext` correctly syncs user state with backend JWT validation. | HIGH |
