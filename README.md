# SentiqAI 🧠 — AI-Powered Guest Review Intelligence

A full-stack web app that helps hospitality businesses (hotels, homestays,
restaurants) understand guest feedback through sentiment analysis and a
centralized review dashboard.

> Built during the **TBI-GEU Summer Internship Program 2026** for Trishul
> Eco-Homestays, Chopta, Uttarakhand.

**Project status (Week 7):** Frontend (Next.js) connected to a working
REST API backend (Node.js + Express + MongoDB/Mongoose), with JWT +
Google OAuth authentication (Week 6) and a real AI integration (Week 7):
the AI Insights page now calls Google Gemini through a backend endpoint
to classify guest review sentiment, instead of a client-side mock.

### ✅ Week 7 deliverables

| Deliverable | Where |
|---|---|
| 1. AI feature live end-to-end (input → loading → output, secure key, error handling) | `app/ai-insights/page.jsx` + `backend/controllers/aiController.js` + `backend/services/geminiService.js` |
| 2. Demo screenshots + Network tab (200 OK) | [`W7_AIFeatureDemo_TBI-26100004.pdf`](./W7_AIFeatureDemo_TBI-26100004.pdf) |
| 3. Prompts log (3 variants tested + rationale) | [`PROMPTS.md`](./PROMPTS.md) |
| 4. Peer code review (2 classmates, 150 words each) | submitted via the Week 7 Google Form, not part of this repo |

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
- 🧠 An AI Insights tool that calls Google Gemini to classify a pasted
  review's sentiment in real time, and can save the result straight into
  the review history
- 🛡️ Rate-limited, validated AI endpoint with clear error messages for
  missing config, timeouts, and upstream rate limits — never a raw crash

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
│   ├── ai-insights/page.jsx    # AI sentiment classifier (Gemini) + "Save to Reviews"
│   ├── login/page.jsx          # Backend-connected login
│   ├── signup/page.jsx         # Backend-connected signup
│   ├── about/page.jsx
│   └── components-demo/page.jsx
├── components/                 # Shared UI components (Navbar, Button, Modal, etc.)
├── lib/
│   └── api.js                  # Centralized fetch client for the backend API
├── backend/                    # Express REST API (see backend/README.md)
│   ├── config/db.js
│   ├── controllers/            # includes aiController.js (Week 7)
│   ├── services/                # geminiService.js — Google Gemini API wrapper (Week 7)
│   ├── scripts/                 # testPrompts.js — reproduces PROMPTS.md comparison (Week 7)
│   ├── middleware/
│   ├── validators/
│   ├── models/
│   ├── routes/                  # includes aiRoutes.js (Week 7)
│   ├── seed.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── W4_APICollection_KhyatiUttam.json   # Postman collection (Week 4, Deliverable 2)
├── W7_AIFeatureDemo_TBI-26100004.pdf     # Demo screenshots + Network 200 (Deliverable 2, Week 7)
├── PROMPTS.md                   # AI prompt variations tested (Deliverable 3, Week 7)
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

`.env` needs a `GEMINI_API_KEY` for the `/ai-insights` page to work — get a
free one at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
and paste it in. Without it, `/api/ai/sentiment` returns a clear
"AI service is not configured" error instead of a raw crash.

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
| `/ai-insights`  | Paste a review, get a Gemini-powered sentiment classification (`POST /api/ai/sentiment`), optionally save it as a new review |
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
| POST   | `/ai/sentiment`          | Classify a guest review's sentiment via Google Gemini (Week 7) |

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
   - `/ai-insights` sends a pasted review to `POST /api/ai/sentiment`
     (real Gemini call), shows a loading state, then displays the result;
     "Save to Reviews" adds it to `/reviews`. Try it with the backend
     `GEMINI_API_KEY` unset too — you should see a clean error Toast, not
     a crash.
   - `/signup` then `/login` work against the `users` collection.

See **[PROMPTS.md](./PROMPTS.md)** for the prompt variations tested for
the AI feature and why the current one was chosen, and
**[`W7_AIFeatureDemo_TBI-26100004.pdf`](./W7_AIFeatureDemo_TBI-26100004.pdf)**
for a walkthrough of the feature (input → loading → output) plus the
Network tab confirming a 200 response.

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
