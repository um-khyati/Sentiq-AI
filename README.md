# SentiqAI 🧠 — AI-Powered Guest Review Intelligence

A full-stack web app that helps hospitality businesses (hotels, homestays, restaurants) understand guest feedback through AI-powered sentiment analysis and a centralized review dashboard.

> Built during the **TBI-GEU Summer Internship Program 2026**, in collaboration with **Trishul Eco-Homestays, Chopta, Uttarakhand**.
> Intern: **Khyati Uttam** | Intern ID: **TBI-26100004** | Graphic Era Deemed to Be University, Dehradun

---

## 🔗 Live Links

| Resource | Link |
|---|---|
| 🌐 Live App | [https://sentiq-5dskc6309-um-khyatis-projects.vercel.app](https://sentiq-5dskc6309-um-khyatis-projects.vercel.app) |
| 🖥️ GitHub Repo | [https://github.com/um-khyati/Sentiq-AI](https://github.com/um-khyati/Sentiq-AI) |
| 💼 LinkedIn | [https://www.linkedin.com/in/khyatiuttam/](https://www.linkedin.com/in/khyatiuttam/) |

---

## 📌 Problem Statement

Homestays and small hospitality businesses receive guest reviews across multiple platforms (Google Reviews, TripAdvisor, Booking.com, social media). Manually reading, organizing, and responding to this feedback is time-consuming, and valuable insights often get overlooked.

## 💡 Solution

SentiqAI gives hospitality staff a simple platform to log guest reviews and instantly see sentiment breakdowns:

- 🔴🟡🟢 Sentiment classification (Positive / Neutral / Negative)
- 📊 A dashboard with live review analytics
- 💾 A searchable review history with full CRUD management
- 🧠 An AI Insights tool that calls Google Gemini to classify a pasted review's sentiment in real time, and can save the result straight into the review history
- 🛡️ Rate-limited, validated AI endpoint with clear error messages for missing config, timeouts, and upstream rate limits — never a raw crash
- 🔐 JWT authentication + Google OAuth sign-in

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) | React Server Components + file-based routing, fast dev experience |
| Styling | Tailwind CSS (class-based dark mode) | Rapid, consistent UI styling without leaving JSX |
| Animation | Framer Motion · Lucide React | Smooth UI transitions, consistent icon set |
| Backend | Node.js + Express.js | Lightweight, fast to stand up a REST API |
| Database | MongoDB + Mongoose | Flexible schema, good fit for review documents that can evolve over time |
| Auth | JWT + bcryptjs + Passport (Google OAuth 2.0) | Stateless auth for the REST API, plus one-click Google sign-in |
| Validation | Zod | Schema validation on both auth and AI endpoints, shared middleware factory |
| AI / LLM | Google Gemini (`gemini-1.5-flash`) | Strong NLP for sentiment classification, forced JSON output mode, generous free tier |
| Frontend Hosting | Vercel | Native Next.js support, easy CI/CD from GitHub |
| Backend Hosting | Render | Simple Node.js deployment with a free tier |

---

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
        ├── services/       (geminiService.js — Gemini API wrapper)
        ├── validators/     (Zod schemas)
        └── middleware/     (auth, rate limiting, centralized error handling)
        │
        ▼
   MongoDB (reviews, users collections)
```

---
---

## ⚙️ Getting Started (Local Setup)

You'll run two servers during development: the Next.js frontend (port `3000`) and the Express backend (port `5000`).

### 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env     # then fill in real values — see table below
npm run seed              # optional: populate MongoDB with sample reviews
npm run dev                # starts the API on http://localhost:5000
```

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (default `5000`) |
| `MONGO_URI` | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | Secret used to sign auth tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend origin, used for CORS |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `GOOGLE_CALLBACK_URL` | Must exactly match the Authorized redirect URI in Google Cloud Console |
| `GEMINI_API_KEY` | Free key from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) |
| `GEMINI_MODEL` | Optional, defaults to `gemini-1.5-flash` |

### 2. Frontend setup

From the project root, in a separate terminal:

```bash
npm install
cp .env.local.example .env.local   # points the frontend at http://localhost:5000/api
npm run dev                          # starts the frontend on http://localhost:3000
```

### 3. Build for production

```bash
npm run build
npm start
```

---

## 🧩 API Reference

Base URL: `http://localhost:5000/api` (local) or `https://sentiq-ai-q3rg.onrender.com/api` (production)

### Reviews

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/reviews` | Public | List all reviews (optional `?sentiment=` & `?room=` filters) |
| GET | `/reviews/:id` | Public | Get a single review |
| POST | `/reviews` | 🔒 JWT | Create a review |
| PUT | `/reviews/:id` | 🔒 JWT | Update a review |
| DELETE | `/reviews/:id` | 🔒 JWT | Delete a review |
| GET | `/reviews/search?q=` | Public | Search by guest, room, sentiment, or text |
| GET | `/reviews/stats` | Public | Aggregated sentiment counts (powers the Dashboard) |

### Auth

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| POST | `/auth/register` | Public | Rate-limited (5/15min), Zod-validated |
| POST | `/auth/login` | Public | Rate-limited (5/15min), Zod-validated, returns JWT |
| GET | `/auth/me` | 🔒 JWT | Requires `Authorization: Bearer <token>` |
| GET | `/auth/google` | Public | Starts Google OAuth flow |
| GET | `/auth/google/callback` | Public | Google redirects here; issues JWT, redirects to frontend |

### AI ⭐ (Best / most notable endpoint)

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| POST | `/ai/sentiment` | Public | Rate-limited (20/15min), Zod-validated |

**Request:**
```json
{ "text": "The staff were wonderful and the room was spotless.", "guest": "Amara Okafor", "room": "Deluxe King" }
```

**Response:**
```json
{ "success": true, "data": { "sentiment": "Positive", "confidence": 92, "summary": "Guest praised staff attentiveness and room cleanliness." } }
```

**How it works:** `aiController.js` builds a system + user prompt and calls `geminiService.js`, which hits Gemini's `generateContent` endpoint with `responseMimeType: "application/json"` — forcing strictly valid JSON. The parsed response is then re-validated against a Zod schema before it ever reaches the frontend, so a malformed AI response fails loudly (502) instead of corrupting a saved review.

| Failure case | Response |
|---|---|
| `GEMINI_API_KEY` missing | `500` — "AI service is not configured" |
| Gemini takes >15s | `504` — request timeout |
| Gemini returns 429 | `429` — passed through |
| Gemini returns other non-2xx | `502` — "AI provider returned an error" |
| Gemini reply fails schema validation | `502` — "unexpected response shape" |
| Request body invalid | `400` — Zod error message |

A ready-to-import Postman collection with example requests for every endpoint is included: [`W4_APICollection_KhyatiUttam.json`](./W4_APICollection_KhyatiUttam.json) and [`W6_AuthAPICollection_KhyatiUttam.json`](./W6_AuthAPICollection_KhyatiUttam.json).

---

## 🗄️ Database Schema (MongoDB / Mongoose)

**`Review`**

| Field | Type | Notes |
|---|---|---|
| `guest` | String | required, max 120 chars |
| `room` | String | required, max 120 chars |
| `sentiment` | String | enum: `Positive`, `Negative`, `Neutral` |
| `score` | Number | 0–100 |
| `text` | String | required, max 2000 chars |
| `date` | Date | defaults to now |
| `createdAt` / `updatedAt` | Date | auto (timestamps) |

Indexed as a text index on `guest`, `room`, `text` to power the search endpoint.

**`User`**

| Field | Type | Notes |
|---|---|---|
| `name` | String | required, max 120 chars |
| `email` | String | required, unique, lowercase |
| `password` | String | bcrypt-hashed, min 8 chars, never returned by default |
| `authProvider` | String | `local` or `google` |
| `googleId` | String | set when signed up via Google OAuth |
| `createdAt` / `updatedAt` | Date | auto (timestamps) |

---

## 🤖 AI Feature

**Model used:** Google Gemini `gemini-1.5-flash` (configurable via `GEMINI_MODEL`)
**Use case:** A pasted guest review is sent to Gemini, which returns a strict JSON object — sentiment classification (Positive/Negative/Neutral), a 0–100 confidence score, and a one-to-two sentence, staff-actionable summary naming the specific thing that drove the sentiment (e.g. staff attentiveness, wifi, cleanliness).

Three prompt variants were tested (zero-shot, role + strict JSON schema, and reasoning-guided JSON-only) — the role + strict-JSON-schema variant was chosen for production because it's the only one that reliably returns parseable JSON every time. Full comparison in [`PROMPTS.md`](./PROMPTS.md).

---

## 🚀 Deployment

- **Frontend:** Deployed on Vercel — [sentiq-5dskc6309-um-khyatis-projects.vercel.app](https://sentiq-5dskc6309-um-khyatis-projects.vercel.app)
- **Backend:** Deployed on Render — [sentiq-ai-q3rg.onrender.com](https://sentiq-ai-q3rg.onrender.com)
- ⚠️ **Open item:** finish the Google OAuth production redirect URI setup in Google Cloud Console — add `https://sentiq-ai-q3rg.onrender.com/api/auth/google/callback` as an Authorized redirect URI, matching `GOOGLE_CALLBACK_URL` in production `.env`

---

## 📚 What I Learned

This internship pushed me past tutorial-level AI integration into building something production-minded. Getting Google Gemini to return reliably parseable output meant testing three different prompt strategies before landing on a role-based system prompt with a strict JSON schema — a good lesson in why "it usually works" isn't good enough when a backend depends on the response. Implementing JWT auth alongside Google OAuth taught me how much of real authentication is really about edge cases: token expiry, provider-specific user records, and CORS configured for a specific frontend origin rather than a wildcard. Deploying across two separate platforms (Vercel for the frontend, Render for the backend) also made production configuration real for me for the first time — environment variables, redirect URIs, and CORS origins all needed to match exactly between local and deployed environments, in a way that's easy to gloss over when everything just runs on localhost. Building this for an actual hospitality client, Trishul Eco-Homestays, made the problem feel real rather than academic, and that context shaped decisions like keeping AI-generated summaries staff-actionable instead of just technically correct.

---

## 👤 Author

**Khyati Uttam**
B.Tech Computer Science Engineering, Graphic Era Deemed to Be University

- GitHub: [https://github.com/um-khyati](https://github.com/um-khyati)
- LinkedIn: [https://www.linkedin.com/in/khyatiuttam/](https://www.linkedin.com/in/khyatiuttam/)

## 📄 License

This project is under active development as part of an academic internship program.

---

> *"Every guest review is a valuable signal. SentiqAI aims to ensure that none of it gets lost in the noise."*
