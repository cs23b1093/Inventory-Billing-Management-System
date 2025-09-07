## Inventory Management API

A Node.js + Express + MongoDB backend for basic inventory, stakeholders, transitions, and reporting. Includes JWT auth, rate-limiting, CORS, Helmet, and structured logging.

### Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 5
- **DB**: MongoDB via Mongoose
- **Auth**: JWT (cookies or Bearer token)
- **Security**: Helmet, CORS
- **Rate limiting**: express-rate-limit (+ sensitive endpoints)
- **Logging**: winston

### Prerequisites
- Node.js 18+
- MongoDB instance/URI

### Getting Started
1. Install deps:
```bash
npm install
```
2. Create `.env` in project root:
```bash
PORT=3000
MONGOOSE_URI=mongodb://localhost:27017/inventory
JWT_SECRET=super-secret
# Optional
REDIS_URL=redis://localhost:6379
```
3. Run the server (nodemon):
```bash
npm run dev
```
Server starts on `http://localhost:3000` by default.

### NPM Scripts
- `npm run dev`: Start with nodemon
- `npm start`: Start with nodemon (same as dev here)

### Project Structure
```text
src/
  config/         # DB and optional Redis client
  controllers/    # Route handlers
  middleware/     # Auth, errors, versioning, rate-limiters
  models/         # Mongoose schemas
  routers/        # Route definitions
  utils/          # Logger, CORS, validators, helpers
  server.js       # App bootstrap
```

### Environment Variables
- **PORT**: App port (default 3000)
- **MONGOOSE_URI**: Mongo connection string (required)
- **JWT_SECRET**: Secret for signing/verifying JWTs (required)
- **REDIS_URL**: Optional, currently commented out in code

### API Versioning
All routes are served under `ApiVersioning('v1')`, so base path is `/api/v1`.

### Authentication
- JWT is expected via cookie `accessToken` or `Authorization: Bearer <token>` header.
- Protected routes use `getUserByCookies` middleware.

### Endpoints
Base URL: `/api/v1`

#### Auth (`/auth`)
- POST `/register`
- POST `/login`
- POST `/logout` (protected)
- GET `/user/:userId` (protected)

#### Products (`/products`)
- POST `/create` (protected)
- GET `/all`
- GET `/get/:productId`
- PUT `/update/:productId` (protected)
- DELETE `/delete/:productId` (protected)

#### Stake Holders (`/stackHolder`)
- POST `/create` (protected)
- PATCH `/update/:stackHolderId` (protected)
- DELETE `/delete/:stackHolderId` (protected)
- GET `/get/:stackHolderId` (protected)
- GET `/all` (protected)
- GET `/search` (protected)

#### Transitions (`/transition`)
- POST `/create`
- GET `/all`

#### Reports (`/reports`) [protected]
- GET `/inventory`
- GET `/transaction`

#### Dummy (`/`)
- Mounted at `/api/v1` (see `dummy.route.js` for details)

### Rate Limiting
- Global limiter via `generalRateLimiter`.
- Sensitive endpoints additionally use `sensitiveRateLimiter`:
  - `/auth/register`, `/auth/login`, `/auth/logout`
  - `/products/create`, `/products/update`, `/products/delete`
  - `/stackHolder/create`, `/stackHolder/update`, `/stackHolder/delete`
  - `/transition/create`

### CORS & Security
- CORS configured by `CorsInitialisation` in `utils/corsSetup.js`.
- Helmet is enabled by default.

### Logging
- Centralized logging via `utils/logger.js`. Requests are logged with method, URL, and body.

### Sample Requests
```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Passw0rd!"}'

# Login (receives accessToken cookie or JWT)
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Passw0rd!"}' -i

# Get all products
curl http://localhost:3000/api/v1/products/all

# Create product (authorized)
curl -X POST http://localhost:3000/api/v1/products/create \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Widget","sku":"W-1","quantity":10}'
```

### Notes
- Redis client is present but commented out for easy testing.
- Ensure MongoDB is running and `MONGOOSE_URI` is valid.

### License
ISC
