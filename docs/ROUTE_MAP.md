# ROUTE MAP

## PUBLIC

- **Route**: `/categories/[category]`
  - **Page**: Category Listings
  - **Role**: Public
  - **Source Design**: `screen (10).png`
  - **Source HTML**: `code (10).html`
  - **Purpose**: Browse specific category
  - **Auth Required**: No

- **Route**: `/explore`
  - **Page**: Explore / Search
  - **Role**: Public
  - **Source Design**: `screen (11).png`
  - **Source HTML**: `code (11).html`
  - **Purpose**: Search and filter assets
  - **Auth Required**: No

- **Route**: `/`
  - **Page**: Home Landing Page
  - **Role**: Public
  - **Source Design**: `screen (14).png`
  - **Source HTML**: `code (14).html`
  - **Purpose**: Main entry point and value prop
  - **Auth Required**: No

- **Route**: `/about`
  - **Page**: About / Curation
  - **Role**: Public
  - **Source Design**: `screen (15).png`
  - **Source HTML**: `code (15).html`
  - **Purpose**: Brand mission and curation standards
  - **Auth Required**: No

- **Route**: `/404`
  - **Page**: 404 Not Found
  - **Role**: Public
  - **Source Design**: `screen (24).png`
  - **Source HTML**: `code (24).html`
  - **Purpose**: Error state
  - **Auth Required**: No

- **Route**: `/products/[id]`
  - **Page**: Product Details
  - **Role**: Public
  - **Source Design**: `screen (30).png`
  - **Source HTML**: `code (30).html`
  - **Purpose**: Asset specifications and booking
  - **Auth Required**: No

- **Route**: `/profile/[id]`
  - **Page**: Public Profile
  - **Role**: Public
  - **Source Design**: `screen (33).png`
  - **Source HTML**: `code (33).html`
  - **Purpose**: Member dossier and custody record
  - **Auth Required**: No

## AUTH

- **Route**: `/forgot-password`
  - **Page**: Forgot Password
  - **Role**: Public
  - **Source Design**: `screen (13).png`
  - **Source HTML**: `code (13).html`
  - **Purpose**: Password recovery
  - **Auth Required**: Yes

- **Route**: `/signup`
  - **Page**: Sign Up
  - **Role**: Public
  - **Source Design**: `screen (26).png`
  - **Source HTML**: `code (26).html`
  - **Purpose**: Account creation
  - **Auth Required**: Yes

- **Route**: `/login`
  - **Page**: Log In
  - **Role**: Public
  - **Source Design**: `screen (29).png`
  - **Source HTML**: `code (29).html`
  - **Purpose**: User authentication
  - **Auth Required**: Yes

## BORROWER

- **Route**: `/borrower/rentals/[id]`
  - **Page**: Active Rental Details
  - **Role**: Borrower
  - **Source Design**: `screen.png`
  - **Source HTML**: `code.html`
  - **Purpose**: Track active rental custody
  - **Auth Required**: Yes

- **Route**: `/booking/[id]/confirmation`
  - **Page**: Booking Confirmation
  - **Role**: Borrower
  - **Source Design**: `screen (6).png`
  - **Source HTML**: `code (6).html`
  - **Purpose**: Digital custody pass and receipt
  - **Auth Required**: Yes

- **Route**: `/checkout`
  - **Page**: Checkout Review
  - **Role**: Borrower
  - **Source Design**: `screen (7).png`
  - **Source HTML**: `code (7).html`
  - **Purpose**: Review reservation details
  - **Auth Required**: Yes

- **Route**: `/borrower/dashboard`
  - **Page**: Borrower Dashboard
  - **Role**: Borrower
  - **Source Design**: `screen (8).png`
  - **Source HTML**: `code (8).html`
  - **Purpose**: Overview of rentals and requests
  - **Auth Required**: Yes

- **Route**: `/checkout`
  - **Page**: Escrow Details
  - **Role**: Borrower
  - **Source Design**: `screen (28).png`
  - **Source HTML**: `code (28).html`
  - **Purpose**: Explain security deposit
  - **Auth Required**: Yes

- **Route**: `/borrower/wishlist`
  - **Page**: Wishlist
  - **Role**: Borrower
  - **Source Design**: `screen (34).png`
  - **Source HTML**: `code (34).html`
  - **Purpose**: Saved rental items
  - **Auth Required**: Yes

- **Route**: `/products/[id]`
  - **Page**: Date Picker Modal
  - **Role**: Borrower
  - **Source Design**: `screen (37).png`
  - **Source HTML**: None
  - **Purpose**: Select rental dates
  - **Auth Required**: Yes

- **Route**: `/borrower/rentals/[id]`
  - **Page**: Alternate Design
  - **Role**: Borrower
  - **Source Design**: `screen1.png`
  - **Source HTML**: None
  - **Purpose**: Variant of active rental
  - **Auth Required**: Yes

## OWNER

- **Route**: `/owner/products/new`
  - **Page**: Add/Edit Product
  - **Role**: Owner
  - **Source Design**: `screen (2).png`
  - **Source HTML**: `code (2).html`
  - **Purpose**: Upload new asset with media
  - **Auth Required**: Yes

- **Route**: `/owner/calendar`
  - **Page**: Availability Calendar
  - **Role**: Owner
  - **Source Design**: `screen (19).png`
  - **Source HTML**: `code (19).html`
  - **Purpose**: Manage asset availability
  - **Auth Required**: Yes

- **Route**: `/owner/bookings`
  - **Page**: Booking Requests
  - **Role**: Owner
  - **Source Design**: `screen (20).png`
  - **Source HTML**: `code (20).html`
  - **Purpose**: Approve/reject custody requests
  - **Auth Required**: Yes

- **Route**: `/owner/dashboard`
  - **Page**: Owner Dashboard
  - **Role**: Owner
  - **Source Design**: `screen (21).png`
  - **Source HTML**: `code (21).html`
  - **Purpose**: Business overview and top assets
  - **Auth Required**: Yes

- **Route**: `/owner/earnings`
  - **Page**: Owner Earnings
  - **Role**: Owner
  - **Source Design**: `screen (22).png`
  - **Source HTML**: `code (22).html`
  - **Purpose**: Financial yields and ledger
  - **Auth Required**: Yes

- **Route**: `/owner/products`
  - **Page**: Owner Products
  - **Role**: Owner
  - **Source Design**: `screen (23).png`
  - **Source HTML**: `code (23).html`
  - **Purpose**: Manage owned listings
  - **Auth Required**: Yes

## ADMIN

- **Route**: `/admin/dashboard`
  - **Page**: Admin Dashboard
  - **Role**: Admin
  - **Source Design**: `screen (3).png`
  - **Source HTML**: `code (3).html`
  - **Purpose**: Marketplace operations overview
  - **Auth Required**: Yes

- **Route**: `/admin/marketplace/products`
  - **Page**: Admin Products
  - **Role**: Admin
  - **Source Design**: `screen (4).png`
  - **Source HTML**: `code (4).html`
  - **Purpose**: Catalog moderation
  - **Auth Required**: Yes

- **Route**: `/admin/people`
  - **Page**: Admin Users
  - **Role**: Admin
  - **Source Design**: `screen (5).png`
  - **Source HTML**: `code (5).html`
  - **Purpose**: User management and dossier
  - **Auth Required**: Yes

- **Route**: `/admin/marketplace/categories`
  - **Page**: Admin Categories
  - **Role**: Admin
  - **Source Design**: `screen (12).png`
  - **Source HTML**: `code (12).html`
  - **Purpose**: Category management
  - **Auth Required**: Yes

- **Route**: `/admin/analytics`
  - **Page**: Admin Analytics
  - **Role**: Admin
  - **Source Design**: `screen (25).png`
  - **Source HTML**: `code (25).html`
  - **Purpose**: Platform metrics and revenue
  - **Auth Required**: Yes

- **Route**: `/admin/trust/reviews`
  - **Page**: Admin Reviews
  - **Role**: Admin
  - **Source Design**: `screen (27).png`
  - **Source HTML**: `code (27).html`
  - **Purpose**: Moderate reputation feedback
  - **Auth Required**: Yes

- **Route**: `/admin/trust`
  - **Page**: Admin Trust & Safety
  - **Role**: Admin
  - **Source Design**: `screen (32).png`
  - **Source HTML**: `code (32).html`
  - **Purpose**: Arbitration and anomaly radar
  - **Auth Required**: Yes

- **Route**: `/admin/marketplace/bookings`
  - **Page**: Admin Bookings
  - **Role**: Admin
  - **Source Design**: `screen (35).png`
  - **Source HTML**: None
  - **Purpose**: Marketplace booking oversight
  - **Auth Required**: Yes

- **Route**: `/admin/finance`
  - **Page**: Admin Finance
  - **Role**: Admin
  - **Source Design**: `screen (39).png`
  - **Source HTML**: None
  - **Purpose**: Payment & refund ops
  - **Auth Required**: Yes

- **Route**: `/admin/settings`
  - **Page**: Admin Settings
  - **Role**: Admin
  - **Source Design**: `screen (40).png`
  - **Source HTML**: None
  - **Purpose**: System config
  - **Auth Required**: Yes

## UTILITY

- **Route**: `/messages`
  - **Page**: Messages
  - **Role**: Borrower/Owner
  - **Source Design**: `screen (16).png`
  - **Source HTML**: `code (16).html`
  - **Purpose**: User to user communication
  - **Auth Required**: Yes

