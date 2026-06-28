# SentiqAI 🧠 — AI-Powered Guest Review Intelligence

A full-stack web app that helps hospitality businesses (hotels, homestays,
restaurants) understand guest feedback through sentiment analysis and a
centralized review dashboard.

> Built during the **TBI-GEU Summer Internship Program 2026** for Trishul
> Eco-Homestays, Chopta, Uttarakhand.

**Project status (Week 4):** Frontend (Next.js) connected to a working
REST API backend (Node.js + Express + MongoDB/Mongoose). Reviews are now
stored in a real database instead of mock/static data, with full
create/read/update/delete support from the UI.

---

## 📌 Problem Statement

Homestays and small hospitality businesses receive guest reviews across
multiple platforms (Google Reviews, TripAdvisor, Booking.com, social
media). Manually reading, organizing, and responding to this feedback is
time-consuming and often leads to valuable insights being overlooked.

## 💡 Solution

SentiqAI gives hospitality staff a simple platform to log guest reviews
and instantly see sentiment breakdowns:

- 🔴🟡🟢 Sentiment classification (Positive / Neutral / Negative)
- 📊 A dashboard with live review analytics
- 💾 A searchable review history with full CRUD management
- 🧠 An AI Insights tool that classifies a pasted review and can save it
  straight into the review history

## 🛠️ Tech Stack

**Frontend**
- Next.js 14 (App Router) + JavaScript
- Tailwind CSS (class-based dark mode)
- Framer Motion (animations) · Lucide React (icons)

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- dotenv · cors · bcryptjs · jsonwebtoken
- nodemon (dev)

## 🏗️ Architecture

```text
Next.js Frontend (app/, components/, lib/api.js)
        │  fetch() calls
        ▼
Express REST API (backend/)
        │
        ├── controllers/  (business logic)
        ├── models/        (Mongoose schemas)
        ├── routes/        (Express routers)
        └── middleware/    (centralized error handling)
        │
        ▼
   MongoDB (reviews, users collections)
```

---

## Project Structure

```
sentiqai/
├── app/                        # Next.js App Router pages
│   ├── page.jsx                # Home
│   ├── dashboard/page.jsx      # Live stats + recent reviews (backend-connected)
│   ├── reviews/page.jsx        # Full CRUD review list (backend-connected)
│   ├── ai-insights/page.jsx    # AI sentiment classifier + "Save to Reviews"
│   ├── login/page.jsx          # Backend-connected login
│   ├── signup/page.jsx         # Backend-connected signup
│   ├── about/page.jsx
│   └── components-demo/page.jsx
├── components/                 # Shared UI components (Navbar, Button, Modal, etc.)
├── lib/
│   └── api.js                  # Centralized fetch client for the backend API
├── backend/                    # Express REST API (see backend/README.md)
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── W4_APICollection_KhyatiUttam.json   # Postman collection (Deliverable 2)
├── .env.local.example          # Frontend env template
├── package.json
└── README.md
```

---

## Getting Started

You'll run two servers during development: the Next.js frontend (port
`3000`) and the Express backend (port `5000`).

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env     # then edit .env — see backend/README.md for details
npm run seed              # optional: populate MongoDB with sample reviews
npm run dev                # starts the API on http://localhost:5000
```

See **[backend/README.md](./backend/README.md)** for full details: MongoDB
setup (local or Atlas), environment variables, and the complete API
reference.

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

## Dark / Light Mode

- Toggle the sun/moon icon in the navbar to switch themes.
- Defaults to the visitor's system preference on first visit.
- The chosen theme is saved to `localStorage` and restored on return visits.
- A small inline script in `app/layout.jsx` applies the theme before paint
  to avoid a flash of the wrong theme.

## Pages

| Route          | Description                                                        |
|-----------------|---------------------------------------------------------------------|
| `/`             | Home – Hero + feature cards                                        |
| `/dashboard`    | Live stats + recent reviews, fetched from `GET /api/reviews/stats` and `GET /api/reviews` |
| `/reviews`      | Full review list with search, create, edit, and delete             |
| `/ai-insights`  | Paste a review, get an instant sentiment classification, optionally save it as a new review |
| `/login`        | Authenticates against `POST /api/auth/login`                       |
| `/signup`       | Registers a new account via `POST /api/auth/register`              |
| `/about`        | About SentiqAI                                                      |

## Backend API Summary

Base URL: `http://localhost:5000/api`

| Method | Endpoint              | Purpose                                  |
|--------|-------------------------|--------------------------------------------|
| GET    | `/reviews`              | List all reviews                           |
| GET    | `/reviews/:id`           | Get one review                             |
| POST   | `/reviews`               | Create a review                            |
| PUT    | `/reviews/:id`           | Update a review                            |
| DELETE | `/reviews/:id`           | Delete a review                            |
| GET    | `/reviews/search?q=`     | Search/filter reviews                      |
| GET    | `/reviews/stats`         | Aggregated sentiment counts (Dashboard)    |
| POST   | `/auth/register`         | Create a user account                      |
| POST   | `/auth/login`            | Authenticate, receive a JWT                |

Full details, request/response examples, and error formats are in
[backend/README.md](./backend/README.md). A ready-to-import Postman
collection with example requests and responses for every endpoint is at
[`W4_APICollection_KhyatiUttam.json`](./W4_APICollection_KhyatiUttam.json).

## Testing

1. Start MongoDB, then the backend (`npm run dev` inside `backend/`).
2. Import `W4_APICollection_KhyatiUttam.json` into Postman and run the
   requests in the **Reviews** and **Auth** folders to exercise the API
   directly.
3. Start the frontend (`npm run dev` at the project root) and verify in
   the browser:
   - `/reviews` loads data from MongoDB, and Add/Edit/Delete work.
   - `/dashboard` shows live counts that match what's in the database.
   - `/ai-insights` classifies a pasted review and "Save to Reviews" adds
     it to `/reviews`.
   - `/signup` then `/login` work against the `users` collection.

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
