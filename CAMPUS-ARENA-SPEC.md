# CAMPUS ARENA — Implementation Spec (Session 2)
**Handoff document for Claude Code. Read fully before writing any code.**

## 0. Context & hard rules

- This EXTENDS the existing `mern-deploy-starter` repo (Express + Mongoose server, Vite React client, JWT auth, Session heartbeat, admin dashboard). Do NOT restructure it.
- **This is a teaching codebase for 3rd-year students.** Every non-obvious block gets a short `// why` comment in the same style as the existing files (see `server/models/User.js`). Clarity beats cleverness everywhere.
- Keep the existing conventions: routes thin → controllers do work → models own rules; one axios instance; pages in `client/src/pages/`; ES modules on client, CommonJS on server.
- Deployment target stays: client on Vercel, server on Render, DB on Atlas. Nothing may assume same-origin.
- **Allowed new deps ONLY:** server: `nanoid@3` (CommonJS-compatible). Client: `lottie-react` (gsap already present). Nothing else — no socket.io, no redis, no express-rate-limit (hand-roll it, it's a lesson).
- Polling only for realtime-ish features (existing 10s pattern). WebSockets are explicitly out of scope (next session).

## 1. Feature list

| # | Feature | Student-visible outcome |
|---|---|---|
| F1 | Reaction game | After login: "Tap Start → tap the dot 10 times as fast as you can" → total ms score |
| F2 | Anti-cheat game sessions | Server-issued game token; impossible scores rejected |
| F3 | Leaderboard | Top 20 + "your rank" with $setWindowFields; medal styling for top 3 |
| F4 | Players near you | Opt-in geolocation → others within 25 km, distance shown |
| F5 | Referral system | Every user gets a code; share link pre-fills signup; admin sees $graphLookup referral tree |
| F6 | Notifications | Toast system (useContext) + poll `/api/notifications` every 10s; "X beat your best score!" |
| F7 | Feedback | Form with validation + rate limit (1/user/hour) + admin $text search |
| F8 | Animations | GSAP on game states + one Lottie (trophy) on new personal best |

## 2. Data models

### 2.1 User — ADD fields (do not remove existing)
```js
referralCode:  { type: String, unique: true, index: true },   // nanoid(8), generated pre-save on create
referredBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
bestScoreMs:   { type: Number, default: null },
location: {                                   // GeoJSON Point — LNG FIRST (teach this loudly)
  type:        { type: String, enum: ['Point'] },
  coordinates: { type: [Number] },            // [lng, lat], rounded to 2 decimals (~1 km) before save
},
```
- `userSchema.index({ location: '2dsphere' }, { sparse: true })`
- Round coordinates server-side in the controller (privacy by design — comment it).

### 2.2 GameSession (new) — the anti-cheat anchor
```js
user: ObjectId ref User, required, index
startedAt: Date, default now
finishedAt: Date, default null
status: enum ['active','completed','rejected'], default 'active'
scoreMs: Number, default null
createdAt via timestamps
```
- TTL index: `{ startedAt: 1 }, { expireAfterSeconds: 600 }` — abandoned sessions self-delete. Comment: "TTL index = Mongo's self-cleaning table".

### 2.3 Notification (new)
```js
user: ObjectId ref User, index        // recipient
type: enum ['BEAT_SCORE','NEW_REFERRAL','WELCOME']
message: String
seen: { type: Boolean, default: false, index: true }
timestamps
```

### 2.4 Feedback (new)
```js
user: ObjectId ref User, index
message: { type: String, required, minlength: 10, maxlength: 500 }
rating: { type: Number, min: 1, max: 5, required }
timestamps
```
- Text index: `feedbackSchema.index({ message: 'text' })`

## 3. API contract (all under existing auth middleware except where noted)

| Method & path | Auth | Body / query | Success response | Error cases |
|---|---|---|---|---|
| POST `/api/game/start` | JWT | — | `{ gameId }` | 429 if user has an `active` session younger than 3s (spam guard) |
| POST `/api/game/finish` | JWT | `{ gameId, scoreMs }` | `{ scoreMs, bestScoreMs, isPersonalBest, rank }` | 404 unknown/expired gameId; 400 if not `active`; 400 REJECTED if cheat checks fail |
| GET `/api/game/leaderboard` | JWT | — | `{ top: [...20], me: { rank, scoreMs } }` | — |
| GET `/api/game/nearby` | JWT | — | `{ players: [{ name, bestScoreMs, distanceKm }] }` | 400 if caller has no location saved |
| PUT `/api/users/location` | JWT | `{ lat, lng }` | `{ saved: true }` | 400 invalid range |
| GET `/api/users/referral` | JWT | — | `{ code, link, invited: [{ name, joinedAt }], count }` | — |
| GET `/api/admin/referral-tree` | JWT+admin | `?userId=` optional | nested tree via $graphLookup (see 5.3) | — |
| GET `/api/notifications` | JWT | — | `{ items: [...unseen, max 10], unseenCount }` | — |
| POST `/api/notifications/seen` | JWT | `{ ids: [] }` | `{ ok: true }` | — |
| POST `/api/feedback` | JWT | `{ message, rating }` | `{ ok: true }` | 429 if one submitted in last hour (hand-rolled check on Feedback.createdAt) |
| GET `/api/admin/feedback` | JWT+admin | `?q=searchText` | `$text` search results with score, else latest 20 | — |
| POST `/api/auth/signup` | — | EXTEND: accept optional `referralCode` | unchanged + resolves `referredBy`; creates WELCOME notification; creates NEW_REFERRAL notification for referrer | invalid code → ignore silently (comment why: signup must never fail on a bad ref) |

## 4. Anti-cheat flow (F2) — implement exactly

1. Client hits `POST /api/game/start` BEFORE showing the first dot → server creates GameSession, returns `gameId`. Server clock is the only clock.
2. Client plays (10 targets), measures ms locally for UI, then `POST /api/game/finish { gameId, scoreMs }`.
3. Server validation, in order:
   - session exists, belongs to `req.user`, status `active`;
   - `elapsed = now - startedAt`; reject if `scoreMs > elapsed + 1500` (client claims faster than physically possible given server clock; 1500ms network grace);
   - reject if `scoreMs < 10 * 120` (=1200ms; <120ms average per tap is beyond human reaction — comment the number);
   - reject if `scoreMs > 60000` (junk data guard).
4. On reject: mark session `rejected`, return 400 `{ message: 'Nice try. Server clocks don't lie.' }` — yes, exactly this message, it's a teaching moment.
5. On accept: mark `completed`, save scoreMs; if better than `bestScoreMs`, update user + `isPersonalBest: true`; then find users whose bestScoreMs was better than old best but worse than new best… **simplify**: notify the user previously ranked immediately above if they got overtaken (`BEAT_SCORE`). Keep the query simple and commented.
6. Return fresh rank (reuse the leaderboard pipeline with $match on user).

## 5. Required aggregations (these ARE the lesson — comment each stage)

### 5.1 Leaderboard rank — `$setWindowFields`
```
[ { $match: { bestScoreMs: { $ne: null } } },
  { $setWindowFields: { sortBy: { bestScoreMs: 1 },
      output: { rank: { $rank: {} } } } },
  ... top 20 $limit / me via $match on _id ]
```

### 5.2 Nearby — `$geoNear` (must be first stage; 2dsphere; maxDistance 25000 m; exclude self; convert distance to km with 1 decimal in $project)

### 5.3 Referral tree — `$graphLookup`
```
{ $graphLookup: { from: 'users', startWith: '$_id',
    connectFromField: '_id', connectToField: 'referredBy',
    as: 'downline', maxDepth: 4, depthField: 'level' } }
```
Return `{ name, level }` grouped by level. Admin UI renders an indented list (no fancy tree lib).

### 5.4 Feedback search — `$text` with `{ score: { $meta: 'textScore' } }`, sorted by score.

## 6. Client work

New/changed files (keep everything else untouched):
```
src/context/ToastContext.jsx      // provider + useToast(); auto-dismiss 4s; slide-in via GSAP
src/components/NotificationBell.jsx  // navbar bell + unseen badge; 10s poll; marks seen on open
src/pages/Game.jsx                // states: idle → countdown(3,2,1) → playing(10 dots) → result
src/pages/Leaderboard.jsx         // top 20 + my-rank card; medals top 3; nearby players section + "share my location" opt-in button
src/pages/Feedback.jsx            // controlled form, star rating, client validation mirroring server
src/components/ReferralCard.jsx   // code, share button, invited list; shown on Leaderboard page
src/pages/Signup.jsx              // EXTEND: read ?ref= from URL, prefill hidden referral field, pass to signup()
src/App.jsx                       // routes: /game, /leaderboard, /feedback; wrap app in ToastProvider; bell in navbar
```
- Game dots: absolutely-positioned button at random coords inside a fixed 320×420 arena div; ms via `performance.now()`.
- GSAP: dot pop-in scale animation; result number count-up; card entrance (reuse Login pattern with fromTo + cleanup — StrictMode-safe, this is mandatory).
- Lottie: ONE trophy animation on `isPersonalBest` (bundle a small local JSON in `src/assets/trophy.json`; no network fetch).
- Share: `navigator.share({ url: link })` with clipboard-copy fallback + toast "Link copied!".
- Geolocation: `navigator.geolocation.getCurrentPosition` ONLY on explicit button tap, never on page load; on grant → PUT location → toast; on deny → friendly message, feature stays off.

## 7. Seed script — EXTEND
Existing users get: referral codes; a small referral chain (admin → Arun → Priya → Divya, Karthik under Arun) so $graphLookup shows 3 levels on first demo; bestScoreMs values spread 2400–5200; locations spread within ~20 km of `[77.60, 11.30]` (Erode region — 2 decimals); 2 sample notifications; 3 feedback entries with searchable words ("game", "awesome", "slow wifi").

## 8. Acceptance checklist (verify each before finishing)
- [ ] `npm run seed` → login as arun@demo.com → leaderboard shows ranks + medals, nearby shows players with km
- [ ] Play game end-to-end; personal best triggers Lottie + toast; overtaken user gets notification on their next poll
- [ ] `curl` POST /api/game/finish with scoreMs=500 → 400 "Nice try..."; finish without start → 404
- [ ] Signup via `?ref=<code>` link → referrer's invited list grows + referrer gets NEW_REFERRAL toast; bad code signup still succeeds
- [ ] Feedback: second submit within an hour → 429; admin search `?q=wifi` returns the seeded entry
- [ ] Admin referral-tree endpoint returns 3 levels for admin user
- [ ] Location never requested without button tap; coords stored with 2 decimals; no location → nearby returns 400 handled gracefully in UI
- [ ] StrictMode on: no ghost/invisible cards, no doubled polls (all effects have cleanup)
- [ ] `node --check` passes on all server files; client builds with `npm run build`
- [ ] Every new file has teaching comments in the established style

## 9. Non-goals (do NOT build)
Socket.io/change streams, push notifications/service workers, Docker (next session), Redis, admin moderation UI, pagination beyond top-20, avatar uploads, i18n.

---
*Saravonix Technologies — teaching repo. Built Right. Held Secure.*
