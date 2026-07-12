# SentiqAI 🧠 — AI-Powered Guest Review Intelligence

A full-stack web app that helps hospitality businesses (hotels, homestays,
restaurants) understand guest feedback through sentiment analysis and a
centralized review dashboard.

> Built during the **TBI-GEU Summer Internship Program 2026** for Trishul
> Eco-Homestays, Chopta, Uttarakhand.

**Project status (Week 6):** Full authentication and security layer added
on top of the Week 4 backend. Users can register and log in with
bcrypt-hashed passwords or sign in with Google, receive a signed JWT,
and access protected routes and API endpoints. Auth endpoints are
rate-limited and validated, and the frontend enforces login on protected
pages.

---

## 📌 Problem Statement

Homestays and small hospitality businesses receive guest reviews across
multiple platforms (Google Reviews, TripAdvisor, Booking.com, social
media). Manually reading, organizing, and responding to this feedback is
time-consuming and often leads to valuable insights being overlooked.

## 💡 Solution

SentiqAI gives hospitality staff a simple, secure platform to log guest
reviews and instantly see sentiment breakdowns:

- 🔴🟡🟢 Sentiment classification (Positive / Neutral / Negative)
- 📊 A dashboard with live review analytics
- 💾 A searchable review history with full CRUD management
- 🧠 An AI Insights tool that classifies a pasted review and can save it
  straight into the review history
- 🔐 Secure accounts — email/password or Google sign-in, JWT-protected
  routes, and rate-limited auth endpoints

## 🛠️ Tech Stack

**Frontend**
- Next.js 14 (App Router) + JavaScript
- Tailwind CSS (class-based dark mode)
- Framer Motion (animations) · Lucide React (icons)

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- dotenv · cors · bcryptjs · jsonwebtoken
- Passport.js (`passport-google-oauth20`) — Google OAuth 2.0
- zod — request validation
- express-rate-limit — brute-force protection on auth endpoints
- nodemon (dev)

## 🏗️ Architecture

```text
Next.js Frontend (app/, components/, lib/api.js)
        │  fetch() calls, JWT sent as Authorization: Bearer <token>
        ▼
Express REST API (backend/)
        │
        ├── controllers/  (business logic)
        ├── models/        (Mongoose schemas)
        ├── routes/        (Express routers)
        ├── middleware/    (auth guard, rate limiting, error handling)
        ├── validators/    (zod request-body schemas)
        └── config/        (Passport Google OAuth strategy)
        │
        ▼
   MongoDB (reviews, users collections)
        ▲
        │
   Google OAuth 2.0 (accounts.google.com)
```

---

## Project Structure

```
sentiqai/
├── app/                            # Next.js App Router pages
│   ├── page.jsx                    # Home
│   ├── dashboard/page.jsx          # Protected — live stats + recent reviews
│   ├── reviews/page.jsx            # Protected — full CRUD review list
│   ├── ai-insights/page.jsx        # AI sentiment classifier + "Save to Reviews"
│   ├── login/page.jsx              # Email/password + "Continue with Google"
│   ├── signup/page.jsx             # Email/password + "Continue with Google"
│   ├── auth/callback/page.jsx      # Handles the redirect after Google sign-in
│   ├── about/page.jsx
│   └── components-demo/page.jsx
├── components/
│   ├── RouteGuard.jsx              # Client-side auth guard — redirects to /login
│   └── ...                         # Navbar, Button, Modal, etc.
├── lib/
│   └── api.js                      # Centralized fetch client (attaches JWT to requests)
├── backend/                        # Express REST API (see backend/README.md)
│   ├── config/
│   │   ├── db.js
│   │   └── passport.js             # Google OAuth 2.0 strategy
│   ├── controllers/
│   ├── middleware/
│   │   ├── authMiddleware.js       # requireAuth — verifies the JWT
│   │   ├── rateLimiter.js          # 5 requests / 15 min on auth endpoints
│   │   └── errorMiddleware.js
│   ├── validators/
│   │   └── authValidators.js       # zod schemas for register/login
│   ├── models/
│   ├── routes/
│   ├── seed.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── W4_APICollection_KhyatiUttam.json     # Postman collection — Reviews CRUD
├── W6_AuthAPICollection_TBI-26100004.json # Postman collection — Auth flows
├── .env.local.example              # Frontend env template
├── package.json
└── README.md
```

---

## Getting Started

You'll run two servers during development: the Next.js frontend (port
`3000`) and the Express backend (port `5000`). You'll also need MongoDB
running locally or a MongoDB Atlas connection string.

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env     # then edit .env — see backend/README.md for details
npm run seed              # optional: populate MongoDB with sample reviews
npm run dev                # starts the API on http://localhost:5000
```

`.env` requires, at minimum, `MONGO_URI` and `JWT_SECRET` to run. Google
sign-in additionally requires `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
/ `GOOGLE_CALLBACK_URL` — see **[backend/README.md](./backend/README.md)**
for the full setup walkthrough, including how to get Google OAuth
credentials from the Google Cloud Console.

### 2. Frontend setup

From the project root (a separate terminal):

```bash
npm install
cp .env.local.example .env.local   # points the frontend at http://localhost:5000/api
npm run dev                          # starts the frontend on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The
backend must be running for the Dashboard, Reviews, AI Insights, Login,
and Signup pages to load real data.

### 3. Build for production

```bash
npm run build
npm start
```

---

## Authentication & Security

- **Registration & login** — passwords are hashed with bcrypt (10 salt
  rounds) before being stored; plaintext passwords are never persisted
  or returned.
- **JWT sessions** — a successful login/registration/Google sign-in
  returns a signed JWT (7-day expiry by default), which the frontend
  stores and sends as `Authorization: Bearer <token>` on subsequent
  requests.
- **Google OAuth 2.0** — "Continue with Google" on `/login` and
  `/signup` starts the flow via `GET /api/auth/google`; on success the
  backend issues the same JWT format as a normal login and redirects to
  `/auth/callback`, which finishes the sign-in on the frontend.
- **Protected API routes** — creating, updating, or deleting a review
  requires a valid JWT (`backend/middleware/authMiddleware.js`); reads
  stay public. Requests without a valid token receive `401`.
- **Protected frontend routes** — `/dashboard` and `/reviews` are
  wrapped in `RouteGuard`, which checks the JWT against
  `GET /api/auth/me` and redirects to `/login` if it's missing or
  invalid.
- **Rate limiting** — `/api/auth/login` and `/api/auth/register` are
  capped at 5 requests per IP per 15-minute window; exceeding it
  returns `429`.
- **Input validation** — registration and login payloads are validated
  with zod before touching the database.
- **CORS** — only the configured `CLIENT_URL` origin may call the API.

## Dark / Light Mode

- Toggle the sun/moon icon in the navbar to switch themes.
- Defaults to the visitor's system preference on first visit.
- The chosen theme is saved to `localStorage` and restored on return visits.
- A small inline script in `app/layout.jsx` applies the theme before paint
  to avoid a flash of the wrong theme.

## Pages

| Route             | Access    | Description                                                        |
|--------------------|-----------|-----------------------------------------------------------------------|
| `/`                | Public    | Home – Hero + feature cards                                          |
| `/dashboard`       | Protected | Live stats + recent reviews, fetched from `GET /api/reviews/stats` and `GET /api/reviews` |
| `/reviews`         | Protected | Full review list with search, create, edit, and delete               |
| `/ai-insights`     | Public    | Paste a review, get an instant sentiment classification, optionally save it as a new review |
| `/login`           | Public    | Email/password login, or "Continue with Google"                      |
| `/signup`          | Public    | Register a new account via email/password, or "Continue with Google" |
| `/auth/callback`   | Public    | Completes the Google sign-in flow and redirects to `/dashboard`      |
| `/about`           | Public    | About SentiqAI                                                        |

## Backend API Summary

Base URL: `http://localhost:5000/api`

| Method | Endpoint                    | Access    | Purpose                                     |
|--------|-------------------------------|-----------|-------------------------------------------------|
| GET    | `/reviews`                    | Public    | List all reviews                                |
| GET    | `/reviews/:id`                 | Public    | Get one review                                  |
| POST   | `/reviews`                     | Protected | Create a review                                 |
| PUT    | `/reviews/:id`                  | Protected | Update a review                                 |
| DELETE | `/reviews/:id`                  | Protected | Delete a review                                 |
| GET    | `/reviews/search?q=`           | Public    | Search/filter reviews                           |
| GET    | `/reviews/stats`               | Public    | Aggregated sentiment counts (Dashboard)         |
| POST   | `/auth/register`               | Public    | Create a user account (rate-limited, validated) |
| POST   | `/auth/login`                   | Public    | Authenticate, receive a JWT (rate-limited, validated) |
| GET    | `/auth/me`                      | Protected | Get the current logged-in user                  |
| GET    | `/auth/google`                  | Public    | Start the Google OAuth flow                     |
| GET    | `/auth/google/callback`         | Public    | Google OAuth callback — issues a JWT            |

Protected endpoints require an `Authorization: Bearer <token>` header;
requests without one return `401`.

Full details, request/response examples, and error formats are in
[backend/README.md](./backend/README.md). Two ready-to-import Postman
collections are included:

- [`W4_APICollection_KhyatiUttam.json`](./W4_APICollection_KhyatiUttam.json) — Reviews CRUD
- [`W6_AuthAPICollection_TBI-26100004.json`](./W6_AuthAPICollection_TBI-26100004.json) — Register, login (auto-saves the JWT), and protected requests using it

## Testing

1. Start MongoDB, then the backend (`npm run dev` inside `backend/`).
2. Import both Postman collections and run their requests to exercise
   the API directly — the Week 6 collection's Login request automatically
   saves the returned JWT so the protected requests after it work out of
   the box.
3. Start the frontend (`npm run dev` at the project root) and verify in
   the browser:
   - `/signup` then `/login` work against the `users` collection, and
     bcrypt-hashed passwords show up in MongoDB (never plaintext).
   - "Continue with Google" completes the OAuth flow and lands you on
     `/dashboard` logged in.
   - Logging out and visiting `/dashboard` or `/reviews` directly
     redirects to `/login`.
   - `/reviews` loads data from MongoDB, and Add/Edit/Delete work while
     logged in.
   - `/dashboard` shows live counts that match what's in the database.
   - `/ai-insights` classifies a pasted review and "Save to Reviews" adds
     it to `/reviews`.
   - Submitting `/login` with the wrong password 6 times in under 15
     minutes returns a `429` rate-limit error on the 6th attempt.

## 🎓 Internship Project

This project is being developed as part of the **TBI-GEU Summer
Internship Program 2026** in collaboration with **Trishul Eco-Homestays,
Chopta, Uttarakhand**.

## 👤 Author

**Khyati Uttam**
B.Tech Computer Science Engineering, Graphic Era University

- GitHub: https://github.com/um-khyati
- LinkedIn: https://www.linkedin.com/in/khyatiuttam/

## 📄 License

This project is under active development as part of an academic
internship program. License information will be added upon project
completion.

---

> *"Every guest review is a valuable signal. SentiqAI aims to ensure that none of it gets lost in the noise."*
