# Zorvyn - Finance Dashboard Backend

A logically structured backend for a finance dashboard system featuring user role management, financial records management, and aggregated summary analytics.

## Technology Stack
- **Node.js** with **Express**
- **TypeScript** for type safety and maintainability
- **Prisma ORM** with **SQLite** for easy setup and relational data modeling
- **Zod** for schema-based request validation
- **JWT** (JSON Web Tokens) and **BcryptJS** for secure authentication

## Features
- **User & Role Management**:
    - **Admin**: Full control over users and records.
    - **Analyst**: Access to records (read-only) and dashboard insights.
    - **Viewer**: Access only to summary level dashboard data.
- **Financial Records**:
    - Manage transactions with fields: `amount`, `type` (INCOME/EXPENSE), `category`, `date`, and `description`.
    - Advanced filtering by type, category, and date ranges.
- **Dashboard APIs**:
    - **Summaries**: Total income, total expenses, and current net balance.
    - **Categorical Totals**: Breakdown of spending/earning by category.
    - **Trend Analysis**: Monthly income vs expense trends for the last 6 months.
    - **Recent Activity**: Log of latest record entries with user attribution.
- **Security**:
    - Role-based Access Control (RBAC) enforced via middleware.
    - Password hashing using bcrypt.
    - JWT-protected routes.
- **Validation & Reliability**:
    - Strict input validation using Zod schemas.
    - Global error handler for consistent error responses and status codes.

## Setting Up
1. Install dependencies: `npm install`
2. Initialize database: `npx prisma migrate dev`
3. Generate Prisma client: `npx prisma generate`
4. Run in development: `npm run dev`
5. Build for production: `npm run build`

## API Endpoints

### Auth
- `POST /api/auth/signup`: Create a new user (Role defaults to VIEWER).
- `POST /api/auth/login`: Authenticate and receive a JWT.

### Dashboard (All Roles)
- `GET /api/dashboard/summary`: Retrieve aggregated finance data, recent moves, and trends.

### Financial Records
- `GET /api/records`: Fetch all records (Filtered by owner for non-admins). (Analyst/Admin)
- `GET /api/records/:id`: Fetch a single record. (Analyst/Admin)
- `POST /api/records`: Create a new transaction record. (Admin only)
- `PATCH /api/records/:id`: Update an existing record. (Admin only)
- `DELETE /api/records/:id`: Remove a record. (Admin only)

### User Management (Admin Only)
- `GET /api/users`: List all system users.
- `GET /api/users/:id`: Fetch specific user profile.
- `PATCH /api/users/:id`: Update user role or status.
- `DELETE /api/users/:id`: Remove a user account.

## Assumptions & Trade-offs
- **SQLite**: Picked for simplicity in this assessment, requiring no external setup. Easily swappable to PostgreSQL or MySQL via Prisma.
- **Role Permissions**: Strictly followed the prompt's role-based behavior. Viewer sees dashboard only, Analyst sees records too (RO), Admin manages everything.
- **Auth Simulation**: Full JWT flow implemented but secret keys should be moved to secure vaults in production.
- **Data Filtering**: Date ranges are handled as ISO strings in queries.
