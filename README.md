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
4. Run in development: `npm run dev` 
5. Run tests: `npm test`

## 🚀 Key API Endpoints (Localhost)

For local development, use the base URL: `http://local-url/api`

### 1. 🔐 Authentication (Public)
The following routes are used to manage user access.

| Method | Endpoint | Full Local URL | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/signup` | `http://local-url/api/auth/signup` | Create a new user account |
| `POST` | `/auth/login` | `http://local-url/api/auth/login` | Login to receive a JWT access token |

### 2. 👤 User Management (Protected)
Requires a valid `ADMIN` token for most operations.

| Method | Endpoint | Full Local URL | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/users/profile` | `http://local-url/api/users/profile` | `ANY` | Get your own profile details |
| `GET` | `/users` | `http://local-url/api/users` | `ADMIN` | List all system users |
| `GET` | `/users/:id` | `http://local-url/api/users/:id` | `ADMIN` | Get specific user by ID |
| `PATCH` | `/users/:id` | `http://local-url/api/users/:id` | `ADMIN` | Update user role/status |
| `DELETE` | `/users/:id` | `http://local-url/api/users/:id` | `ADMIN` | Soft delete/disable a user |

### 3. 📊 Financial Records (Protected)
Manage transactions and perform advanced searches.

| Method | Endpoint | Full Local URL | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/records` | `http://local-url/api/records` | `ANALYST+` | Search, filter, and list records |
| `GET` | `/records/:id` | `http://local-url/api/records/:id` | `ANALYST+` | View record details |
| `POST` | `/records` | `http://local-url/api/records` | `ADMIN` | Create a new transaction |
| `PATCH` | `/records/:id` | `http://local-url/api/records/:id` | `ADMIN` | Update a record |
| `DELETE` | `/records/:id` | `http://local-url/api/records/:id` | `ADMIN` | Soft delete a record |

### 4. 📈 Dashboard Analytics (Protected)
Aggregated data for charts and summaries.

| Method | Endpoint | Full Local URL | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/dashboard/summary` | `http://local-url/api/dashboard/summary` | `ANY` | Finance trends and activity logs |

---

## 🛠️ Testing with Postman

Since most endpoints are protected, follow these steps to test them locally:

1.  **Signup/Login**: Use `POST /api/auth/login` with your credentials to receive a JSON response containing a `"token"`.
2.  **Authorize**: Copy the token string (without quotes).
3.  **Set Headers**: In Postman, go to the **Authorization** tab of any protected request.
    - Set **Type** to `Bearer Token`.
    - Paste your token into the **Token** field.
4.  **Send**: You are now authorized! The API will return data based on your user role.

---

## Access Matrix
| Feature | Viewer | Analyst | Admin |
|---------|--------|---------|-------|
| Dashboard | ✅ | ✅ | ✅ |
| List Records | ❌ | ✅ | ✅ |
| Create Records | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| Self-Profile | ✅ | ✅ | ✅ |
