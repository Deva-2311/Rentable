# MOCK DATA AUDIT

This document identifies all mock, fallback, and placeholder data scattered throughout the frontend application.

| File | Feature | Purpose | Can replace with API? | Status |
|------|---------|---------|-----------------------|--------|
| `src/utils/mockData.ts` | Global Mock Data | Provides high-fidelity `MOCK_PRODUCTS` when backend is disconnected. | Yes | DEMO ONLY |
| `src/app/(public)/explore/ExploreClient.tsx` | Explore Grid | Uses `MOCK_PRODUCTS` as a fallback when `useProducts` API call fails. | Yes | SAFE FALLBACK |
| `src/app/(public)/products/[id]/ProductDetailClient.tsx` | Product Details | Uses `MOCK_PRODUCTS` as a fallback when `useProduct(id)` API fails or is unreachable. | Yes | SAFE FALLBACK |
| `src/app/(public)/categories/[category]/CategoryClient.tsx` | Category Products | Uses a hardcoded `MOCK_PRODUCTS` array for displaying category items. | Yes | DEMO ONLY |
| `src/app/(public)/page.tsx` | Landing Page | Hardcoded categories and featured products mock data. | Yes | DEMO ONLY |
| `src/app/checkout/page.tsx` | Booking Checkout | Calculates pricing using mock logic, uses fallback dates, and generates a mock booking ID instead of a real payment intent. | Yes | DEMO ONLY |
| `src/app/owner/products/new/page.tsx` | Add Product UI | UI interface mock boundary reached. Form doesn't connect to `useCreateProduct` yet. | Yes | MUST REPLACE |
| `src/app/admin/marketplace/products/page.tsx` | Admin Products | Contains a "Data Table Placeholder" without real data binding. | Yes | DEMO ONLY |
| `src/app/admin/analytics/page.tsx` | Admin Analytics | Contains a "Charts Placeholder Area". | Yes | DEMO ONLY |
| `src/app/admin/page.tsx` | Admin Dashboard | Contains a "Real-time Activity Feed placeholder". | Yes | DEMO ONLY |
| `src/app/admin/people/page.tsx` | Admin Users | Contains "Dummy row 1", "Dummy row 2", etc., and pagination placeholders. | Yes | DEMO ONLY |

## Conclusion

The core marketplace public flow (Explore, Product Details) uses a robust fallback pattern with `MOCK_PRODUCTS` that allows seamless demonstration when the backend is offline. However, critical authenticated flows such as checkout, owner product creation, and admin dashboards rely purely on un-interactive placeholders or hardcoded dummy components. These must be integrated with the backend API to be considered production-ready.
