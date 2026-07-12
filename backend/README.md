# SentiqAI Backend — REST API

Node.js + Express + MongoDB (Mongoose) backend for the SentiqAI guest review
intelligence platform. Built for the Week 4 assignment to provide a working
REST API behind the existing Next.js frontend.

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- dotenv (environment variables)
- cors (allow the Next.js frontend to call the API)
- bcryptjs + jsonwebtoken (password hashing & auth, backs the Login/Signup pages)
- nodemon (dev auto-restart)

## Folder Structure

```
backend/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── reviewController.js    # CRUD + search + stats logic for reviews
│   └── authController.js      # register / login logic
├── middleware/
│   ├── errorMiddleware.js      # centralized 404 + error handler
│   └── asyncHandler.js         # wraps async controllers, forwards errors
├── models/
│   ├── Review.js               # Review schema
│   └── User.js                 # User schema (hashed passwords)
├── routes/
│   ├── reviewRoutes.js
│   └── authRoutes.js
├── seed.js                      # populates MongoDB with sample reviews
├── server.js                    # app entry point
├── .env.example
├── .gitignore
└── package.json
```

## 1. Install dependencies

```bash
cd backend
npm install
```

## 2. Configure environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

| Variable        | Description                                              |
|-----------------|------------------------------------------------------------|
| `PORT`          | Port the API listens on (default `5000`)                  |
| `MONGO_URI`     | MongoDB connection string (local or Atlas)                 |
| `JWT_SECRET`    | Secret used to sign auth tokens                             |
| `JWT_EXPIRES_IN`| Token lifetime, e.g. `7d`                                   |
| `NODE_ENV`      | `development` or `production`                               |
| `CLIENT_URL`    | Frontend origin, used for CORS (`http://localhost:3000`)    |

## 3. MongoDB setup

**Option A — Local MongoDB**
1. Install MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Start the MongoDB service (`mongod`).
3. Use `MONGO_URI=mongodb://localhost:27017/sentiqai` in `.env`.

**Option B — MongoDB Atlas (cloud, no local install)**
1. Create a free cluster at https://www.mongodb.com/cloud/atlas.
2. Create a database user and allow your IP (or `0.0.0.0/0` for development).
3. Copy the connection string into `MONGO_URI` in `.env`, e.g.
   `mongodb+srv://<user>:<password>@<cluster>/sentiqai?retryWrites=true&w=majority`

## 4. (Optional) Seed sample data

Populates the `reviews` collection with the same 6 sample reviews the
frontend used to show as mock data, so the UI has something to display
immediately:

```bash
npm run seed
```

## 5. Run the server

```bash
npm run dev      # development, auto-restarts on file changes (nodemon)
# or
npm start        # production
```

The API will be available at `http://localhost:5000`.

## API Endpoints

Base URL: `http://localhost:5000/api`

### Reviews

| Method | Endpoint               | Description                                  |
|--------|-------------------------|-----------------------------------------------|
| GET    | `/reviews`              | Get all reviews (optional `?sentiment=` & `?room=` filters) |
| GET    | `/reviews/:id`           | Get a single review by ID                     |
| POST   | `/reviews`               | Create a new review                           |
| PUT    | `/reviews/:id`           | Update an existing review                     |
| DELETE | `/reviews/:id`           | Delete a review                               |
| GET    | `/reviews/search?q=`     | Search reviews by guest, room, sentiment, or text |
| GET    | `/reviews/stats`         | Aggregated counts (total/positive/negative/neutral) — powers the Dashboard |

### Auth

| Method | Endpoint           | Description                          |
|--------|---------------------|----------------------------------------|
| POST   | `/auth/register`    | Create a new user account (Signup page) |
| POST   | `/auth/login`       | Authenticate and receive a JWT (Login page) |

See `W4_APICollection_KhyatiUttam.json` (or wherever it's stored in this repo)
for a ready-to-import Postman collection with example requests/responses for
every endpoint above.

## Example: Review object

```json
{
  "_id": "665f1c2e8b3a4d2f1c9e8b3a",
  "guest": "Amara Okafor",
  "room": "Deluxe King",
  "sentiment": "Positive",
  "score": 92,
  "text": "Staff were incredibly attentive and the room was spotless.",
  "date": "2026-06-18T00:00:00.000Z",
  "createdAt": "2026-06-20T10:15:32.000Z",
  "updatedAt": "2026-06-20T10:15:32.000Z"
}
```

## Error responses

All errors are returned as JSON with a consistent shape and the correct
HTTP status code (400, 401, 404, 500, etc.):

```json
{
  "success": false,
  "message": "Review not found with id 64f..."
}
```

## Testing the API

You can test endpoints with:
- The Postman collections (`W4_APICollection_*.json`, `W6_AuthAPICollection_*.json`) — recommended.
- `curl`, e.g.:
  ```bash
  curl http://localhost:5000/api/reviews
  ```
- The connected Next.js frontend (see the root `README.md`).

## Week 6 — Authentication & Security

Copy `.env.example` to `.env` and fill in the real values before running the
server; the auth system won't start correctly without `JWT_SECRET`, and
Google sign-in won't work without the `GOOGLE_*` variables.

### Auth endpoints

| Method | Route | Access | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Rate-limited (5/15min), zod-validated |
| POST | `/api/auth/login` | Public | Rate-limited (5/15min), zod-validated, returns JWT |
| GET | `/api/auth/me` | **Protected** | Requires `Authorization: Bearer <token>` |
| GET | `/api/auth/google` | Public | Starts the Google OAuth flow |
| GET | `/api/auth/google/callback` | Public | Google redirects here; issues a JWT and redirects to `/auth/callback?token=...` on the frontend |

`POST/PUT/DELETE /api/reviews...` also require a valid JWT (see
`backend/routes/reviewRoutes.js`); `GET` requests stay public.

### Setting up Google OAuth credentials

1. Go to the [Google Cloud Console credentials page](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** of type "Web application".
3. Under **Authorized redirect URIs**, add exactly:
   `http://localhost:5000/api/auth/google/callback`
4. Copy the generated Client ID / Client Secret into `.env` as
   `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
5. Restart the backend. Clicking "Continue with Google" on `/login` or
   `/signup` will now go through the real consent screen.

### Rate limiting

`/api/auth/login` and `/api/auth/register` are capped at 5 requests per
IP per 15-minute window (`backend/middleware/rateLimiter.js`). Exceeding
it returns `429` with a JSON error body — this is what request #7 in the
Week 6 Postman collection is for.

### CORS

`CLIENT_URL` in `.env` is the *only* origin allowed to call this API. Set
it to your deployed frontend URL in production — the default fallback is
`http://localhost:3000` for local development, not `*`.
