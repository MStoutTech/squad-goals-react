# SQUAD GOALS

**Live app:** [PLACEHOLDER — add Vercel URL once deployed]
**Note:** This app is hosted on Render's free tier, which spins down after periods of inactivity. The first request after idling may take 20-30 seconds to respond while the server wakes up — this is expected, not a bug.

## Introduction

In the spirit of a CRM (Customer Relationship Management) app, Squad Goals seeks to help you manage and improve your personal relationships. Using this app in tandem with your existing messaging and social media, you may find that social media can finally be "social" again.

## Features

- User sessions: sign up, log in, personalized profile page
- Organizing info and memo history of your contacts and recent interactions
- Algorithmically suggested "missions" to remind you to reach out
- Mission timer to help you focus and avoid the trap of infinite scrolling
- Relationship evaluation questions to rank and prioritize healthy relationships that enrich your life the most
- Mini articles to spark better communication

## Tech Stack

- **Frontend:** React 19, Vite, React Router DOM, Tailwind CSS v4, Material UI
- **Backend:** Express, Passport.js (local strategy), express-session
- **Database:** MongoDB (Atlas), Mongoose
- **Media storage:** Cloudinary
- **Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Local Setup

Install all dependencies (at root level, then cd to /client and npm install):

```
npm install
```

Run the app in development (starts client, server, and SCSS watcher concurrently):

```
npm run dev
```

### Environment Variables

Create a `.env` file in `/server/config` with:

```
PORT=3000
DB_STRING=your database URI
CLOUD_NAME=your cloudinary cloud name
API_KEY=your cloudinary api key
API_SECRET=your cloudinary api secret
SESSION_SECRET=your session secret
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Create a `.env` file in `/client` with:

```
VITE_API_URL=http://localhost:3000
```

For local development, confirm `client/vite.config.js`'s proxy target port matches the port your server runs on.

## Deployment Notes

This project is split into two independently deployed services with no shared origin, which means:

- The backend (`server/`) and frontend (`client/`) run on different domains in production, so all API requests are cross-origin.
- CORS is configured via `CLIENT_ORIGIN` on the backend to allow only the deployed frontend's origin.
- Session cookies use `sameSite: "none"` and `secure: true` in production so the session cookie can travel cross-origin over HTTPS — this requires `NODE_ENV=production` to be set explicitly on whatever platform hosts the backend, since not all hosts set this automatically.
- The frontend never uses relative fetch paths; all API calls go through a shared `apiFetch` utility (`client/src/utils/apiUrl.js`) that prepends `VITE_API_URL` and always sends `credentials: "include"`, so session cookies are included on every request.

### Known Limitations / Next Steps

- No CSRF protection yet. Given `sameSite: "none"` is required for cross-origin auth to work at all, and this app stores personal contact information, adding CSRF tokens on state-changing routes is a near-term priority rather than a someday item.
- UX improvements like loading skeletons, toast confirmations, first login walkthroughs and empty states, basic accessibility pass
- Component refactoring for easy readability and more dynamic styling
- Performance improvements (lighthouse and green web scores)
- Login/ security upgrades, deepen account settings capabilities
- Feature wishlist: frequency editing, snooze length editing, mission ratings, calendar view, contact import, frequency tracking affecting score, avoidance detection and gentle nudge notifications, eval importance multipliers, more contact data storage, admin content manager for articles and blog, badges and gamification, mobile app, browser extension, subscription tiers, AI integration, multi-person missions

## Packages / Dependencies

### Backend

- **express** — Node framework for routing and middleware
- **mongoose** — schema modeling and querying for MongoDB
- **passport** / **passport-local** — authentication strategy allowing sign-in with email/password rather than a third-party provider
- **express-session** — cookie-based session tracking for logged-in users
- **connect-mongo** — stores session data in MongoDB rather than in memory
- **bcrypt** — hashes and salts passwords (instead of plain text) before storing them
- **cors** — controls which frontend origin(s) may make cross-origin requests to the API
- **csrf-sync** — double submit CSRF protection
- **dotenv** — loads environment variables from `.env` files
- **express-flash** — one-time flash messages (used for form error messaging)
- **morgan** — logs incoming requests to the console for debugging
- **multer** — parses multipart form data for file uploads making them accessible in routes
- **cloudinary** — stores and serves uploaded contact images
- **validator** — validates string input (e.g. confirming a submitted value is a properly formatted email)

### Frontend

- **react** / **react-dom** — UI library and DOM renderer
- **react-router-dom** — client-side routing, layout routes, protected routes
- **vite** — dev server and build tool
- **tailwindcss** / **@tailwindcss/vite** — utility-first CSS styling
- **sass** — compiles `.scss` files to plain CSS
- **@mui/material** / **@mui/icons-material** — pre-built UI components and icons used in select places (e.g. modals, form controls)
- **@emotion/react** / **@emotion/styled** — CSS-in-JS styling engine; not used directly in this project's own code, but required by Material UI internally
- **concurrently** — runs the client dev server, SCSS watcher, and backend dev server together with one command

### Dev Tooling

- **nodemon** — auto-restarts the backend server on file changes during development (not used in production — the deployed backend runs via plain `node`)
- **eslint** — linting for the client codebase
