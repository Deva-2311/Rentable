# RENTABLE - Premium Product Rental Marketplace

![RENTABLE Banner](https://via.placeholder.com/1200x400/020402/FFFFFF?text=RENTABLE+-+Rent+Anything,+Anywhere)

RENTABLE is a two-sided enterprise-grade product rental marketplace (similar to Airbnb) connecting product owners with borrowers. Users can seamlessly rent physical products such as bikes, cameras, gaming consoles, electronics, furniture, tools, and more.

## ✨ Features

- **Role-Based Access Control (RBAC):** Distinct experiences for Borrowers, Owners, and Admins.
- **Secure Authentication:** JWT-based authentication with Bcrypt password hashing.
- **Premium UI/UX:** Built with Next.js, Tailwind CSS, and shadcn/ui featuring an "Enchanted Forest Whimsy" dark-mode aesthetic.
- **Product Discovery:** Advanced search, category filtering, and product availability calendars.
- **Booking Engine:** End-to-end rental lifecycle management from request to return.
- **Payment Integration:** Secure checkout and wallet system (powered by Razorpay).
- **Comprehensive Dashboards:** Tailored analytics and management views for owners and admins.

## 📚 Comprehensive Project Documentation Suite

For academic submissions, viva voce evaluation, technical architecture, and developer onboarding, refer to the complete documentation suite located in the [`docs/`](./docs) directory:

1. 📄 **[Master Project Documentation (A-to-Z)](./docs/PROJECT_DOCUMENTATION.md):** Complete academic & technical report covering abstract, requirements, architecture, workflows, financial formulas, and security.
2. 🗄️ **[Database Architecture & Schema Reference](./docs/DATABASE_DOCUMENTATION.md):** Detailed MongoDB/Mongoose collection dictionary, entity relationships (Mermaid ER), referential integrity, and indexing.
3. 🌐 **[REST API Specification](./docs/API_DOCUMENTATION.md):** Complete endpoint-by-endpoint reference with request/response payloads, role guards, and error responses.
4. 📖 **[User & Operations Guide](./docs/USER_GUIDE.md):** Step-by-step practical manual for Borrowers, Equipment Owners, and System Administrators.
5. 🛠️ **[Developer Setup & Execution Guide](./docs/DEVELOPER_SETUP.md):** Prerequisites, environment configuration, database seeding, and execution commands.
6. 🧪 **[Testing & Verification Matrix](./docs/TESTING_AND_VERIFICATION.md):** Empirical verification evidence, test execution logs, and automated integration test results.
7. 🎓 **[Viva Voce & Presentation Guide](./docs/VIVA_QUESTIONS.md):** Two-minute pitch, five-minute architecture summary, demonstration script, and 35 viva questions with model answers.
8. 🔍 **[Feature Audit & Gap Analysis](./docs/DOCUMENTATION_GAP_ANALYSIS.md):** Strict verification matrix separating implemented, partial, simulated, and planned capabilities.

---

## 🛠️ Technology Stack

### Frontend (Client)
- **Framework:** Next.js 14+ (App Router) / React
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Redux Toolkit + TanStack Query
- **Forms & Validation:** React Hook Form + Zod
- **Animations:** Framer Motion
- **HTTP Client:** Axios

### Backend (Server)
- **Framework:** NestJS
- **Runtime:** Node.js
- **Database:** MongoDB + Mongoose ORM
- **Authentication:** JSON Web Tokens (JWT) & Passport
- **Security:** Helmet, CORS, ValidationPipe
- **Language:** TypeScript
- **Documentation:** Swagger (OpenAPI)

### Infrastructure
- **Containerization:** Docker & Docker Compose (Multi-stage optimized builds)

---

## 🚀 One-Command Setup (Recommended)

This project is fully dockerized for a seamless, production-grade local development experience. You can spin up the Frontend, Backend, and MongoDB Database with a single command.

### Prerequisites
- Docker
- Docker Compose

### Start the Application

Open your terminal in the root of the project (where `docker-compose.yml` is located) and run:

```bash
docker-compose up --build
```

*(Add `-d` to run in detached mode).*

*(Note: Containers are configured with `restart: "no"` so they will not auto-start in the background on system boot, preventing port conflicts during local development).*

**The services will be available at:**
- **Frontend UI:** [http://localhost:3000](http://localhost:3000)
- **Backend API Docs (Swagger):** [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **MongoDB:** `mongodb://localhost:27017/rentable`

---

## 💻 Manual Setup (Local Development)

If you prefer to run the application without Docker, you can run the services manually. This is recommended for active development with hot-reloading.

### 1. Database Setup
Ensure you have a local instance of MongoDB running on port `27017` or have a MongoDB Atlas URI ready. *(Alternatively, start just the database using `docker compose up mongo -d`)*.

### 2. Install All Dependencies
From the root of the project, install all required packages for the frontend, backend, and root workspace:

```bash
npm run install:all
```

### 3. Run Development Servers
Start both the frontend and backend concurrently in a single terminal:

```bash
npm run dev
```

---

## 🔐 Mock Accounts / Demo Credentials

To quickly test the different roles in the application, you can use the built-in database seed script. To generate these accounts, run the following from the `backend/` folder:

```bash
cd backend
npm run seed:admin
```

This will create the following mock accounts (all use the same password):

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@rentable.com` | `password123` |
| **Owner** | `owner@rentable.com` | `password123` |
| **Borrower** | `borrower@rentable.com` | `password123` |

---

## 📂 Folder Structure

```text
Rentable/
├── backend/               # NestJS REST API
│   ├── src/
│   │   ├── auth/          # Authentication module (JWT, Login, Register)
│   │   ├── users/         # Users module and Mongoose schema
│   │   ├── products/      # Products module
│   │   ├── categories/    # Categories module
│   │   ├── bookings/      # Bookings module
│   │   ├── payments/      # Payments module (Razorpay integration)
│   │   ├── rentals/       # Rentals lifecycle module
│   │   ├── reviews/       # Reviews module
│   │   ├── common/        # Shared guards, filters, and decorators
│   │   ├── main.ts        # NestJS application entry point
│   │   └── app.module.ts  # Root application module
│   └── Dockerfile         # Multi-stage Docker build
│
├── frontend/              # Next.js Application
│   ├── src/
│   │   ├── app/           # Next.js App Router (Pages & Layouts)
│   │   ├── components/    # Reusable UI components (shadcn/ui)
│   │   ├── features/      # Redux slices (Auth, Products)
│   │   ├── lib/           # Utility functions
│   │   └── store/         # Redux store configuration
│   ├── Dockerfile         # Multi-stage Docker build
│   └── tailwind.config.ts
│
├── docker-compose.yml     # Orchestrates Frontend, Backend, and MongoDB
└── README.md              # Project documentation
```

---

## 🛣️ API Documentation

The backend is fully documented using Swagger. Once the backend is running, navigate to:

👉 **[http://localhost:5000/api/docs](http://localhost:5000/api/docs)**

From there, you can view all available endpoints, required payload schemas, and test the endpoints interactively (including adding Bearer tokens for authenticated endpoints).

---

## 🎨 Design System

The application uses a bold, editorial, poster-like design system inspired by high-end interactive portfolios:
- **Global Textures:** A subtle SVG noise overlay for a gritty, tactile, magazine-like feel.
- **Vibrant Backgrounds:** Deep Barca Navy (`#0b1d3a`) and Vibrant Dortmund Yellow (`#fcc700`) replace standard white/dark modes.
- **Typography:** 
  - `Anton` for massive, heavy, blocky headers and anchors.
  - `Rock Salt` for floating handwritten brush stroke accent layers.
  - `Geist Sans` & `Geist Mono` for small, wide-tracked UI navigation and body text.
- **Layout:** Floating focal subjects without traditional borders or cards, and edge-to-edge transparent navigation.

---

## 📄 License

This project is licensed under the MIT License.
# Rentable
Share your experience with the certificate program...