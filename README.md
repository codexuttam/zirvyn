# Zorvyn - Finance Dashboard Backend (Premium Edition)

A highly-polished, secure, and production-ready backend for a finance dashboard system featuring advanced management of user roles and financial transactions.

## Technology Stack
- **Node.js** with **Express** (v5.x for modern routing)
- **TypeScript** (v6.0) with **ESM** (ECMAScript Modules) support
- **Prisma ORM** (v5.22.0) with **SQLite**
- **Zod** for schema-based request validation
- **JWT** (JSON Web Tokens) and **BcryptJS** for secure authentication
- **Vitest** & **Supertest** for automated integration testing
- **Express-Rate-Limit** for API DDoS/brute-force protection

## Features & Enhancements ("The Best")
### 1. User & Role Management
- **RBAC Enforcement**: Strict roles for **Viewer** (ROI), **Analyst** (RO), and **Admin** (CRUD).
- **Soft Delete**: Deleting users logically preserves history while removing active access.
- **Profile API**: Authenticated users can securely retrieve their own account details.
- **Account Status**: Handles `ACTIVE`/`INACTIVE` user status logic.

### 2. Financial Records Management
- **Advanced CRUD**: Managed transactions with full ownership tracking.
- **Pagination**: Supports `page` and `limit` query parameters for high-performance listing.
- **Full-Text Search**: Search records by `category` or `description`.
- **Soft Delete**: Records are logically removed, ensuring database integrity and data recovery options.

### 3. Dashboard Analytics
- **Aggregated Summaries**: Total income, total expenses, and real-time net balance.
- **Categorical Breakdown**: Spending/earning analysis by transaction category.
- **Trend Analysis**: 6-month comparative trends (Monthly income vs expense).
- **Recent Activity**: Activity log with user attribution (filtered by user or system-wide for Admins).

### 4. Reliability & Security
- **Rate Limiting**: Globally applied limiter to prevent API abuse.
- **Validation Layers**: Strict Zod schemas for all request bodies and query strings.
- **Global Error Handling**: Standardized responses with appropriate status codes.
- **Modern ESM Architecture**: Explicit `.js` imports for high-speed module resolution.
- **Integration Tests**: Proven reliability through automated test suites.

## Setting Up
1. Install dependencies: `npm install`
2. Initialize database: `npx prisma migrate dev`
3. Generate Prisma client: `npx prisma generate`
4. Run in development: `npm run dev` (Starts on Port 4000)
5. Run tests: `npm test`

## Key API Endpoints

### Auth
- `POST /api/auth/signup`: Create a new user (Viewer default).
- `POST /api/auth/login`: Authenticate and receive a JWT.

### User Management
- `GET /api/users/profile`: Access current user profile (All roles).
- `GET /api/users`: List all users (Admin only).
- `PATCH /api/users/:id`: Update user role/status (Admin only).
- `DELETE /api/users/:id`: Soft delete a user (Admin only).

### Financial Records
- `GET /api/records`: Integrated search, filter, and pagination (Analyst/Admin). 
    - *Params*: `page`, `limit`, `search`, `type`, `category`, `startDate`, `endDate`.
- `POST /api/records`: Create a new transaction (Admin only).
- `DELETE /api/records/:id`: Soft delete a record (Admin only).

### Dashboard
- `GET /api/dashboard/summary`: Aggregate finance trends and log (All roles).

## Access Matrix
| Feature | Viewer | Analyst | Admin |
|---------|--------|---------|-------|
| Dashboard | ✅ | ✅ | ✅ |
| List Records | ❌ | ✅ | ✅ |
| Create Records | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| Self-Profile | ✅ | ✅ | ✅ |
