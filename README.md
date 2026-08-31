# SQUAD GOALS

**Live app:** [PLACEHOLDER — add Vercel URL once deployed]
**Note:** This app is hosted on Render's free tier, which spins down after periods of inactivity. The first request after idling may take 20-30 seconds to respond while the server wakes up — this is expected, not a bug.

## Introduction

In the spirit of a CRM (Customer Relationship Management) app, Squad Goals seeks to help you manage and improve your personal relationships. Using this app in tandem with your existing messaging and social media, you may find that social media can finally be "social" again.

## Features

### Missions

![Missions screenshot/GIF placeholder]

As the hero of your relationships, your daily missions are to reach out to your contacts. Every contact will always have a scheduled "next" missions that is either picked automatically by the scheduling algorithm, or set manually by you. When a mission is complete, the app immidiately schedules the next one.

The three friendship tiers have their own default contact frequency:

- **Heart-cores** : weekly
- **Ray-liables** : monthly
- **Bud-dies** : quarterly

And there are two mission types, depending on how you are spending time with your contacts:

- **Contact missions** : remote check-ins via text, call, social media. These have a countdown timer keeping you focused on the task at hand (hopefully a deterrant from disctracting feed scrolling)
- **Field missions** : in-person meetups, these have no timer

**Notable pattern:** The next mission scheduling algorith muses a layered set of rules in a priority order for setting the next mission.

1. **Birthday first** If the contact's birthday falls within the upcoming frequency window (this week, this month, or this quarter), the mission is scheduled on the birthday and no further logic is run.
2. **Preferred days** If the contact has set preferred contact days of the week, only those specific days within the window are considered candidates. Otherwise, every day in the window is a candidate.
3. **Load balancing** Among all the candidate days, the algorithm counds how many missions are already scheduled on each one, and picks whichever day currently has the fewest in order to spread out your missions, never over-loading the first day of the week, month, or quarter.

Adding a mission will check for an upcoming mission with the status "new" and deletes it before scheduling the new mission. This way there is no silent doubling of scheduled outreach.

Snoozing also operates on the assumed goal of needing to keep up with the assigned frequency of contacting your squad. Instead of pushing the mission back by a fixed number of days, the frequency window is anchored to the last-contact date and attempts to schedule within the next required frequency window. If that due window is already passed (maybe the mission was left in the queue too long), the next mission is rolled over into the next frequency window instead of attempting to schedule for a date in the past.

### Relationship Evaluation & Scoring

![Evaluation screenshot/GIF placeholder]

Squad Goals scores your relationships to help you to rank and prioritize healthy relationships that enrich your life the most, and also to notice blind spots, where connection might be slipping even if it doesn't feel that way day-to-day.

Every contact starts with your own **connection instinct** your gut read on the relationship. This is heavily weighted and determines the contact's initial tier placement (Heart-cores, Ray-liables, or Bud-dies). From there, you answer evaluation questions that will add or subtract to the initial score based on your answers. Then the updated score will move your contacts up or down on the tier placement giving you insight to where relationships may be struggling.

Because the full evaluation is nearly 100 questions, it was designed to have a way to chip away in small pieces instead of one long sitting.

- You can evaluate **all contacts at once**, **one contact at a time**, or a **custom group** of contacts you choose.
- In "all contacts" or "custom group" modes, the dropdown lets you jump directly to a specific question. For "one contact at a time", the dropdown allows you to switch between contacts as the evaluation would be showing you the full set of questions for that single contact.
- Questions are not presented in a fixed order so no topic feels stale or repetitive. The app will automatically show the next question with the fewest recorded answers by default (and if you want to go back and change an answer or simply change the question, you can use the drop down)
- You can save and stop at any point, or save and immediately continue to the next question.
- Some questions don't have a score, but instead assign a community **role tag** that can be used to filter contacts on your squad page and is viewed in the contact details.

**Notable pattern:** Because the evaluation can be entered from so many different modes, the UI needs to know which setter function and which answer array to update. Rather than having a separate handler at every entry point, the app uses a dynamic `activeSetter` / `activeAnswerArray` pattern where the correct setter and answer array are selected based on the context with a ternary:

```js
const activeAnswerArray =
  questionnaireType == "contacts" ? singleContactAnswers : allContactsAnswers;
const activeSetter =
  questionnaireType == "contacts"
    ? setSingleContactAnswers
    : setAllContactsAnswers;
```

The arrays hold the same shape but different meanings:

- `singleContactAnswers` : one contact, many questions; indexed by question
- `allContactsAnswers` : one question, many contacts; indexed by contact

Since the arrays hold the same shape, the answer-input can be the same (checkbox/radio/slider) and write through the necessary active setter. The population happens with a useEffect for the questionnaire type and not the answer input rows, avoiding a possible render loop on every change.

### Other Features

- User sessions: sign up, log in, personalized profile page
- Organizing info and memo history of your contacts and recent interactions
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

## Architecture Decisions

### Dynamic `.populate()` chaining

The schema for friendship roles can change over time, and what roles exist for a user may be inconsistent. If a user doesn't have a particular role set, a hardcoded list of roles would cause the query to fall out of sync with the data model. To populate the roles dynamically, the app builds the populate chain dynamically.

```js
let userQuery = User.findById(req.user.id);
for (const role of Object.keys(req.user.friendshipRoles)) {
  userQuery = userQuery.populate(
    `friendshipRoles.${role}`,
    "firstName lastName image",
  );
}
const populatedUser = await userQuery.lean();
```

The chain always reflects whatever roles exist right now rather than an assumption about the data made at write-time.

### CSRF Protection: Synchronizer Token

This app uses server-side sessions (express-session) instead of stateless auth. For this reason csrf-sync was suggested over csrf-csrf by the developers of the package. Guest sessions need tokens as well because `postLogin` and `postSignup` are POST requests (vulnerable to CSRF) therefore `getUser` calls `generateToken(req)` and login and signup call with forced token rotation. `getUser` does not rotate to avoid overlapping bursts of calls that may rotate the token and invalidate other calls.

### Known Limitations / Next Steps

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
- **csrf-sync** — synchronizer token pattern stateful csrf since app uses server-side sessions
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
