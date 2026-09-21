# MERN Deploy Starter 🚀

A complete, deployable MERN application with **your own authentication** (no Firebase/Supabase), proper project structure, real MongoDB queries beyond `find()`, and a **live admin dashboard**.

Built as a teaching template by **Saravonix Technologies** — reuse it for every future project.

## What you get

| Feature | Where to look |
|---|---|
| Signup / Login with bcrypt + JWT | `server/controllers/authController.js` |
| Forgot / Reset password (hashed, expiring token) | same file + `models/User.js` |
| Protected routes (frontend guard + backend middleware) | `client/src/App.jsx`, `server/middleware/auth.js` |
| Schemas with validation, indexes, nested JSON, arrays | `server/models/` |
| Medium queries: `$lookup` joins, `$group`, `$unwind`, `$facet`, nested-field filters | `server/controllers/adminController.js`, `noteController.js` |
| Live admin dashboard — who's online right now | `client/src/pages/Admin.jsx` + `models/Session.js` |

## Project structure (follow this in your own projects)

```
server/
  server.js          <- wiring only, keep small
  config/db.js       <- one DB connection
  models/            <- schemas = your "table creation"
  middleware/        <- auth check, activity heartbeat
  controllers/       <- business logic
  routes/            <- URL -> controller mapping
  utils/seed.js      <- demo data
client/
  src/api/axios.js   <- one API instance, token auto-attached
  src/context/       <- auth state for the whole app
  src/pages/         <- one file per screen
```

Rule of thumb: **routes stay thin, controllers do the work, models own the data rules.**

## Run locally

```bash
# 1. Backend
cd server
cp .env.example .env        # fill MONGO_URI (Atlas) and JWT_SECRET
npm install
npm run seed                # demo users: admin@demo.com/admin123, arun@demo.com/student123
npm run dev                 # http://localhost:5000

# 2. Frontend (new terminal)
cd client
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

## Show it to the world in 60 seconds (ngrok)

```bash
ngrok http 5000             # your API is now public
ngrok http 5173             # or expose the frontend
```
Great for demos — dies when your laptop sleeps. For real hosting:

## Deploy (all free tiers)

**One repo, two services.** Netlify and Render both watch this same repository,
but each is pointed at a different folder — Netlify builds `client/`, Render builds
`server/`. Netlify learns that from `netlify.toml` (checked in). Render learns it
either from `render.yaml` or from the Root Directory field you type in — see the
two paths in step 2. Nothing assumes the two halves share an origin, which is why
CORS and `VITE_API_URL` exist.

```
                 GitHub (one public repo)
                    |               |
        base=client |               | rootDir=server
                    v               v
            Netlify (CDN)      Render (Node)  ---->  MongoDB Atlas
            static files       always-on API         M0 free cluster
```

### 1. MongoDB Atlas
Create a free M0 cluster → **Database Access**: add a user with a long random
password → copy the connection string.

Then **Network Access**. You have two options, and the better one is not the
one most tutorials show you:

**Option A — allowlist Render's outbound IPs (preferred).**
Render publishes a small, static set of outbound addresses per service. Find them
in the Render dashboard → your service → **Connect** → **Outbound** (some plans
list them under Settings). You will usually see three IPv4 addresses. Add each one
to Atlas as a `/32` entry, with a comment so the next person knows why it is there:

```
44.xxx.xxx.xxx/32     render-campus-arena-1
44.xxx.xxx.xxx/32     render-campus-arena-2
44.xxx.xxx.xxx/32     render-campus-arena-3
```

> **Add all of them, not just one.** Outbound traffic can leave from any address
> in the set. Allowlisting one gives you an API that works *intermittently*, which
> is far harder to debug than one that fails outright.

**Option B — `0.0.0.0/0` (fallback).** If your plan does not expose outbound IPs,
allow everything and lean entirely on the password. Workable, but strictly worse.

**Be honest about what Option A buys you.** Those IPs belong to Render and are
shared with other Render customers in the same region. Allowlisting them means
"only traffic leaving Render's infrastructure can reach my database at the network
layer" — *not* "only my service can." It shrinks the exposure from the whole
internet to one provider's tenant pool. That is a real improvement, and it is not
isolation. **Keep the long random password either way** — the allowlist is a second
lock, never a replacement for the first. (Genuine network isolation means VPC
peering or Private Endpoint, which needs M10+, so it is off the table on the free
tier.)

Two things that will bite you:

- **Render can change its outbound IPs.** They give notice, but if you miss the
  email your API starts timing out on every database call and it looks exactly
  like a code bug. If Atlas connections suddenly fail with no deploy having
  happened, check the outbound IPs before you read any code.
- **Your own laptop needs its own entry.** The moment you drop `0.0.0.0/0`,
  `npm run seed` from your machine stops working. Use Atlas's *Add Current IP
  Address* button — and remember college or hotel Wi-Fi hands out a different
  address each time, so you will be re-adding it.

### 2. Render (API) — deploy this FIRST

There are two ways in, and **they need different things from you**. Pick one.

#### Path A — Blueprint (uses `render.yaml`)
**New → Blueprint** → connect the repo. Render reads `render.yaml` and fills in
root directory, build command and start command for you. It prompts only for the
two values marked `sync: false`:

| Variable | Value |
|---|---|
| `MONGO_URI` | your Atlas connection string |
| `CLIENT_URL` | `http://localhost:5173` for now — fixed in step 4 |

`JWT_SECRET` is generated by Render automatically (`generateValue: true`), so
nobody types it and it can never leak from a public repo.

> `render.yaml` must exist **on the branch Render is watching**. If the file lives
> on a feature branch and Render is pointed at `main`, it will not be found — and
> Render falls back to asking you for a start command, which is the giveaway.

#### Path B — Web Service (manual, ignores `render.yaml`)
**New → Web Service** → connect the repo. Render does *not* read `render.yaml`
here, so fill these in yourself:

| Field | Value |
|---|---|
| Branch | the branch holding your code |
| Root Directory | `server` |
| Build Command | `npm install` |
| Start Command | `npm start` |

And set **four** environment variables — `JWT_SECRET` included, because nothing
is generating it for you on this path:

| Variable | Value |
|---|---|
| `MONGO_URI` | your Atlas connection string |
| `CLIENT_URL` | `http://localhost:5173` for now — fixed in step 4 |
| `JWT_SECRET` | use Render's **Generate** button, or the command below |
| `NODE_ENV` | `production` |

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

**Do not set `PORT`.** Render injects it; `server.js` already reads
`process.env.PORT || 5000`.

> **`JWT_SECRET` has no fallback in the code.** Miss it and `jwt.sign` throws
> `secretOrPrivateKey must have a value` — every login and signup returns 500
> while the rest of the API looks healthy. Compare it with `JWT_EXPIRES_IN`
> on the same line, which *does* have a `|| '1d'` default and so is optional.

> **`NODE_ENV=production` is a security setting here, not decoration.**
> `authController.forgotPassword` contains
> `if (process.env.NODE_ENV !== 'production') payload.devResetLink = resetLink;`
> — without it, the API hands the password-reset link straight back to whoever
> asked for it. Handy in class, an account-takeover hole in public.

Either way, note your API URL: `https://<your-service>.onrender.com`.

> Free tier sleeps after 15 minutes idle and takes ~50s to wake. Before a class
> demo, open the URL once to warm it up.

### 3. Netlify (client)
**Add new site → Import from Git** → pick the repo. Netlify reads `netlify.toml`,
so base directory, build command and publish directory are already filled in.
Add one environment variable:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://<your-service>.onrender.com/api` |

> **Vite inlines env vars at BUILD time.** Changing `VITE_API_URL` later does
> nothing until you trigger a *redeploy*. This trips up everyone once.

### 4. Close the CORS loop
Go back to Render → Environment → set `CLIENT_URL` to your real Netlify URL
(`https://<your-site>.netlify.app`, no trailing slash) → save, which redeploys.
Until you do this, every API call is blocked by CORS.

> Deploy Previews get their own URLs (`deploy-preview-3--site.netlify.app`) which
> won't match `CLIENT_URL`, so previews will fail CORS. Fine for now; making the
> server accept a list of origins is good homework.

### 5. Seed the database (once)
```bash
MONGO_URI="<your atlas string>" npm run seed --prefix server
```
> `seed.js` starts with `deleteMany()`. It wipes the collections every run.
> Never point it at anything you care about.

### Deploy checklist
- [ ] Atlas user created with a long random password
- [ ] Network Access: Render's outbound IPs added as `/32` (all of them), plus your own IP for seeding
- [ ] If you used Path B: `JWT_SECRET` and `NODE_ENV=production` are set by hand
- [ ] Render service live — visiting `/` returns `{"status":"API running"}`
- [ ] Netlify build green, site loads
- [ ] `CLIENT_URL` on Render matches the Netlify URL exactly (no trailing slash)
- [ ] Login works end to end — if not, open DevTools → Network and read the CORS error

## Push this to your GitHub

```bash
git init
git add .
git commit -m "MERN deploy starter with own auth + admin dashboard"
git branch -M main
git remote add origin https://github.com/<your-username>/mern-deploy-starter.git
git push -u origin main
```

## Things to try next (homework)

1. Add pagination buttons to the Notes page (the API already supports `?page=`).
2. Add a `$lookup` query: which tag do high-priority notes use most?
3. Replace 10-second polling in Admin with WebSockets (socket.io).
4. Add email sending for forgot-password (nodemailer + Gmail app password).
5. Add refresh tokens so sessions last beyond 1 day safely.
6. Turn the client into a PWA — manifest, service worker, offline shell, installable
   on a phone. (Netlify already serves over HTTPS, which a service worker requires.)
7. Let the server accept a *list* of allowed origins so Netlify deploy previews work.

---
*Saravonix Technologies Pvt. Ltd. — Built Right. Held Secure.*
