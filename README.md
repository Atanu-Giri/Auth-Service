# 🔐 Auth-Service

A full-stack **Google OAuth 2.0 authentication service** built with React and Express. Users sign in with their Google account, receive a JWT, and access protected API routes — all without server-side sessions.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Authentication Flow](#-authentication-flow)
- [Project Structure](#-project-structure)
- [File-by-File Breakdown](#-file-by-file-breakdown)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Key Design Decisions](#-key-design-decisions)

---

## 🛠 Tech Stack

| Layer        | Technology                              | Port   |
| ------------ | --------------------------------------- | ------ |
| **Frontend** | React 19, Vite, React Router v7, Axios  | `3000` |
| **Backend**  | Express 5, Passport.js, JWT, Mongoose   | `5000` |
| **Database** | MongoDB Atlas                           | Cloud  |
| **Auth**     | Google OAuth 2.0 via `passport-google-oauth20` | —      |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (:3000)                         │
│                                                                 │
│   /  (Login)  ──►  /success  ──►  /dashboard                   │
│   Click Google      Save JWT       Fetch protected data         │
│   Login button      to localStorage  with Bearer token          │
└───────┬─────────────────────┬───────────────────┬───────────────┘
        │ redirect            │ redirect          │ GET
        ▼                     │                   ▼
┌─────────────────────────────┴───────────────────────────────────┐
│                        BACKEND (:5000)                          │
│                                                                 │
│   /auth/google           /auth/google/callback                  │
│   (Passport initiates    (Find/create user, sign JWT,           │
│    Google OAuth)          redirect to frontend /success)        │
│                                                                 │
│   /api/protected/dashboard                                      │
│   (JWT verified by authMiddleware → return user data)           │
└───────────────────────────────┬─────────────────────────────────┘
                                │ find / create
                                ▼
                    ┌───────────────────────┐
                    │   MongoDB Atlas       │
                    │   (Users Collection)  │
                    └───────────────────────┘
```

---

## 🔄 Authentication Flow

Below is the complete step-by-step flow from login to accessing protected data:

### Step 1 — User Clicks "Login with Google"

The `Login` page renders a button. On click, the browser does a **full-page redirect** to the backend:

```
window.location.href = "http://localhost:5000/auth/google"
```

### Step 2 — Backend Initiates Google OAuth

The `GET /auth/google` route triggers Passport's Google strategy, which redirects the browser to **Google's OAuth consent screen** requesting `profile` and `email` scopes.

### Step 3 — User Grants Permission on Google

The user sees Google's consent screen and approves. Google then redirects back to:

```
GET /auth/google/callback?code=AUTHORIZATION_CODE
```

### Step 4 — Passport Verify Callback (Find or Create User)

Passport exchanges the authorization code for an access token and retrieves the user's profile. The verify callback in `config/passport.js`:

1. Searches MongoDB for a user with the matching `googleId`.
2. If **not found** → creates a new `User` document with `googleId`, `email`, `name`, and `avatar`.
3. Returns the user object to Passport.

### Step 5 — Backend Signs a JWT and Redirects

The callback route handler (`session: false` — no server sessions):

1. Takes `req.user` from Passport.
2. Signs a **JWT** containing `{ id: user._id }` with a **7-day expiry**.
3. Redirects the browser to the frontend:

```
http://localhost:3000/success?token=<JWT>
```

### Step 6 — Frontend Captures the Token (`/success`)

The `Success` page:

1. Reads the `token` query parameter from the URL.
2. Saves it to **`localStorage`**.
3. Immediately navigates to `/dashboard` (replacing browser history).

### Step 7 — Dashboard Fetches Protected Data

The `Dashboard` page:

1. Reads the JWT from `localStorage`.
2. Makes a `GET` request to the backend with the token:

```
GET http://localhost:5000/api/protected/dashboard
Authorization: Bearer <token>
```

### Step 8 — Auth Middleware Validates the JWT

The `authMiddleware`:

1. Extracts the token from the `Authorization: Bearer <token>` header.
2. Verifies it using `jwt.verify(token, JWT_SECRET)`.
3. ✅ **Valid** → attaches decoded payload to `req.user`, calls `next()`.
4. ❌ **Invalid / Missing** → responds with `401 Unauthorized`.

The protected route then returns:

```json
{
  "message": "Welcome to your dashboard",
  "user": { "id": "<mongo_user_id>", "iat": 1234567890, "exp": 1235172690 }
}
```

---

## 📁 Project Structure

```
Auth-Service/
├── backend/
│   ├── config/
│   │   └── passport.js          # Google OAuth 2.0 Passport strategy
│   ├── middlewares/
│   │   └── authMiddleware.js    # JWT verification middleware
│   ├── models/
│   │   └── User.js              # Mongoose User schema
│   ├── routes/
│   │   ├── auth.js              # OAuth routes (login + callback)
│   │   └── protected.js         # JWT-protected API routes
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Google login button
│   │   │   ├── Success.jsx      # Token capture + redirect
│   │   │   └── Dashboard.jsx    # Protected data display
│   │   ├── App.jsx              # React Router setup
│   │   ├── main.jsx             # React DOM entry point
│   │   ├── App.css
│   │   └── index.css
│   ├── vite.config.js           # Vite dev server (port 3000)
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 📄 File-by-File Breakdown

### Backend

| File                          | Purpose                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------- |
| `server.js`                   | Express app entry point — sets up CORS (allowing `CLIENT_URL`), JSON body parsing, Passport initialization, MongoDB connection, and mounts all routes. |
| `config/passport.js`          | Configures the `passport-google-oauth20` strategy. On callback, finds or creates the user in MongoDB by `googleId`, storing `email`, `name`, and `avatar`. |
| `models/User.js`              | Mongoose schema with fields: `googleId` (unique, required), `email` (required), `name` (required), `avatar` (optional). |
| `routes/auth.js`              | Two routes: `GET /auth/google` (initiates OAuth flow) and `GET /auth/google/callback` (receives Google's response, signs JWT, redirects to frontend). |
| `routes/protected.js`         | `GET /api/protected/dashboard` — guarded by `authMiddleware`, returns a welcome message and the decoded JWT user data. |
| `middlewares/authMiddleware.js`| Extracts the JWT from the `Authorization: Bearer` header, verifies it with `jwt.verify()`, and attaches the decoded payload to `req.user`. |
| `.env`                        | Environment config: `PORT`, `MONGO_URI`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `JWT_SECRET`, `CLIENT_URL`. |

### Frontend

| File                    | Purpose                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| `main.jsx`              | React app entry point — renders `<App />` into the DOM inside `StrictMode`.                  |
| `App.jsx`               | Sets up React Router with three routes: `/` (Login), `/success` (Success), `/dashboard` (Dashboard). |
| `pages/Login.jsx`       | Renders the "Login with Google" button. On click, redirects the browser to `GET /auth/google` on the backend. |
| `pages/Success.jsx`     | Acts as a token bridge — reads the JWT from the URL query string, saves it to `localStorage`, then navigates to `/dashboard`. |
| `pages/Dashboard.jsx`   | Fetches data from the protected backend endpoint using the stored JWT in an `Authorization: Bearer` header, then displays the response. |
| `vite.config.js`        | Configures Vite dev server to run on port `3000`.                                            |

---

## 📡 API Reference

### Auth Routes (`/auth`)

| Method | Endpoint                 | Description                                    | Auth Required |
| ------ | ------------------------ | ---------------------------------------------- | ------------- |
| `GET`  | `/auth/google`           | Initiates Google OAuth 2.0 login flow          | No            |
| `GET`  | `/auth/google/callback`  | Google OAuth callback — issues JWT & redirects  | No            |

### Protected Routes (`/api/protected`)

| Method | Endpoint                       | Description                      | Auth Required          |
| ------ | ------------------------------ | -------------------------------- | ---------------------- |
| `GET`  | `/api/protected/dashboard`     | Returns user data from JWT       | Yes (`Bearer <token>`) |

### Root

| Method | Endpoint | Description         | Auth Required |
| ------ | -------- | ------------------- | ------------- |
| `GET`  | `/`      | Health check        | No            |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or above)
- **npm**
- **MongoDB Atlas** account (or a local MongoDB instance)
- **Google Cloud Console** project with OAuth 2.0 credentials

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Atanu-Giri/Auth-Service.git
   cd Auth-Service
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file inside the `backend/` directory with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

JWT_SECRET=your_jwt_secret_key

CLIENT_URL=http://localhost:3000
```

> **Note:** Make sure the **Authorized redirect URI** in your Google Cloud Console is set to:
> `http://localhost:5000/auth/google/callback`

### Running the App

1. **Start the backend** (from the `backend/` directory):

   ```bash
   npm start
   ```

   The server will start on `http://localhost:5000`.

2. **Start the frontend** (from the `frontend/` directory):

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

3. **Open your browser** and navigate to `http://localhost:3000` — click "Login with Google" to begin.

---

## 💡 Key Design Decisions

| Decision                | Rationale                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| **Session-less auth**   | No server-side sessions. Uses `{ session: false }` in Passport and relies entirely on stateless JWTs. |
| **JWT via URL redirect**| After OAuth, the JWT is passed from backend → frontend via a URL query parameter, then saved to `localStorage`. |
| **CORS restriction**    | Backend only accepts requests from `CLIENT_URL` (localhost:3000) with credentials enabled.          |
| **Minimal User model**  | Only stores Google profile data (`googleId`, `email`, `name`, `avatar`) — no local passwords.      |
| **Custom auth middleware** | A lightweight `authMiddleware` verifies JWTs on every protected request instead of using session cookies. |
| **7-day token expiry**  | Balances convenience (users don't re-login frequently) with security.                              |

---

## 📜 License

ISC
