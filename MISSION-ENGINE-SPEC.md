# MISSION ENGINE — Implementation Spec (Session 3)
**Handoff document for Claude Code. Read fully before writing any code.**
Branch: `feature/campus-arena`. Read `CAMPUS-ARENA-SPEC.md` first: this spec follows its conventions and reuses its patterns.

## 0. Context & hard rules

- Enovix teaches concepts; **missions** make students apply them. A mission = **one function, 5–15 lines**, inside something already built. Students never face a blank app.
- Across 7 worlds, students grow two products one function at a time: 🎮 **Campus Quest** (non-violent campus game) and 🏢 **CampusOps** (college operations app). In this session the "product" is represented by a **live preview canvas** per mission; the full products come in a later session.
- **Same lesson as Campus Arena: the browser is untrusted.** The server never accepts "I passed". It generates hidden test inputs, the browser runs the student's function on them, and the server checks the outputs against its own reference. **Student code NEVER runs on the server** (Node's `vm` is not a security boundary; comment this).
- Teaching codebase: every non-obvious block gets a short `// why` comment, same style as `server/controllers/gameController.js`.
- Keep conventions: routes thin → controllers do work → models own rules; one axios instance; pages in `client/src/pages/`; ES modules on client, CommonJS on server; bilingual text `{ en, ta }` with `t()` falling back to `en` when `ta` is missing.
- **Allowed new deps ONLY:** client: `geolib`, `mathjs` (both loaded **only inside the worker, only for bonus stages**, via dynamic `import()`). Server: none.
- Deployment unchanged (Vercel + Render + Atlas). Nothing may assume same-origin.

## 1. Files already provided — DO NOT rewrite their content

| File | What it is |
|---|---|
| `client/src/missions/catalog.js` | All 7 worlds, 42 lessons, 63 missions with `status: 'live' \| 'soon'` |
| `client/src/missions/defs/*.js` + `defs/index.js` | PUBLIC half of the 5 live missions: story, predict question (no answer), `fill`/`write` starters, visible `sampleTests`, optional `bonus`, `preview(ctx, fn, t, W, H)` |
| `server/missions/*.js` + `index.js` + `_shared.js` | SECRET half: `reference()`, `generateInputs(seed)`, `compare()`, `predictAnswer`, `points`, bilingual `hints` |

Content was verified: correct fill-ins pass every hidden test, wrong ones fail, and geolib agrees with the step method on 2,000 hidden cases. You may fix code style, never the maths or wording.

## 2. Feature list

| # | Feature | Student-visible outcome |
|---|---|---|
| M1 | Mission map `/missions` | 7 worlds → lessons → missions, "Live" / "Coming soon" badges, my points + rank, filter 🎮 / 🏢 |
| M2 | Mission player `/missions/:id` | Story → Predict → Fill the gap → Write it → ⭐ Bonus (package), with live preview |
| M3 | Safe runner | Student code runs in a **Web Worker** with a 2 s timeout; infinite loops can't freeze the page |
| M4 | Server-verified grading | Hidden, seeded, per-attempt inputs; server compares outputs with its reference |
| M5 | Hint ladder | 3 hints per mission, served by the server, −5 points each, counted server-side |
| M6 | Points & mission leaderboard | New "Missions" tab on `/leaderboard` using the same `$setWindowFields` + `$facet` pattern |
| M7 | Enovix "coming soon" | Enovix lists **every** catalogue lesson by world; live ones open, the rest show "Coming soon" |
| M8 | Home card | Third card "🚀 Missions" next to Fun Game and Enovix |

## 3. Data models

### 3.1 User — ADD field (do not remove anything)
```js
missionPoints: { type: Number, default: 0, index: true },   // denormalised total; why: the leaderboard sorts on it
```

### 3.2 MissionProgress (new) — one row per user per mission
```js
user:      ObjectId ref User, required, index
missionId: String, required                       // e.g. 'isInsideCampus'
stages:    { predict: Boolean, fill: Boolean, write: Boolean, bonus: Boolean }   // all default false
points:    Number, default 0
hintsUsed: Number, default 0                      // 0..3, only ever increases
attempts:  Number, default 0                      // submissions, pass or fail
firstTryBonus: Boolean, default false
timestamps
```
- Unique compound index `{ user: 1, missionId: 1 }` — comment: "one row per student per mission; points can't be earned twice".

### 3.3 MissionAttempt (new) — the anti-cheat anchor (mirrors GameSession)
```js
user:      ObjectId ref User, required, index
missionId: String, required
stage:     enum ['fill','write','bonus'], required
seed:      Number, required                       // server-chosen; re-creates the same hidden inputs
status:    enum ['active','passed','failed'], default 'active'
code:      String, maxlength 5000                  // stored for teacher review (plagiarism, feedback)
timestamps
```
- TTL index `{ createdAt: 1 }, { expireAfterSeconds: 1800 }` on **active** attempts only (use `partialFilterExpression: { status: 'active' }`) — comment: abandoned attempts clean themselves up, finished ones stay as the student's history.

## 4. API contract (all JWT, under existing `trackActivity`)

| Method & path | Body | Success | Errors |
|---|---|---|---|
| GET `/api/missions/progress` | — | `{ points, rank, missions: { [id]: { stages, points, hintsUsed } } }` | — |
| POST `/api/missions/:id/predict` | `{ choice }` | `{ correct, points }` (points only the first time) | 404 unknown mission |
| POST `/api/missions/:id/hint` | — | `{ level, hint: {en,ta}, points }` next hint, −5 applied once per level | 400 when all 3 used |
| POST `/api/missions/:id/start` | `{ stage }` | `{ attemptId, inputs: [[...args], ...] }` | 404 unknown; 400 bad stage; 429 if an active attempt is < 2 s old |
| POST `/api/missions/:id/submit` | `{ attemptId, outputs: [...], code }` | pass: `{ passed: true, pointsEarned, totalPoints, rank }` · fail: `{ passed: false, failed: n, of: m, example: { input, expected, got } }` | 404 unknown/expired attempt; 400 not active; 400 `outputs.length` mismatch |
| GET `/api/missions/leaderboard` | — | `{ top: [...20], me: { rank, points } }` | — |

Mission ids come from the URL: validate against `server/missions/index.js` **before** anything else (404 otherwise).

## 5. Grading flow — implement exactly

1. Client `POST /start { stage }` → server picks `seed = crypto.randomInt(1, 2**31)`, stores a MissionAttempt, returns `inputs = ref.generateInputs(seed)`. **Expected outputs are never sent.**
2. Client runs the student's function on every input **inside the worker** → `outputs[]`.
3. Client `POST /submit { attemptId, outputs, code }`.
4. Server: attempt exists, belongs to `req.user`, `status === 'active'`, same mission. Re-create inputs from the stored seed. For each i: `ref.compare(ref.reference(...inputs[i]), outputs[i])`.
5. **Bonus stage only:** also require `code.includes(def.bonus.mustUse)` (e.g. `'geolib.'`). The server reads this from `bonusMustUse` in the reference file (already present for `moveToward` → `'math.'` and `isInsideCampus` → `'geolib.'`). Comment: "a cheap check, not proof; it's a learning nudge, not an exam".
6. All pass → `status: 'passed'`; if this stage is not yet done in MissionProgress: mark it, add `points[stage]`; if `attempts === 0` before this submission and `hintsUsed === 0`, add `firstTry` once. `$inc` User.missionPoints by the same amount. Return fresh rank.
7. Any fail → `status: 'failed'`, `attempts++`, return count plus **one** failing example `{ input, expected, got }`. Message: **"Close! A hidden test found a case your code misses."** Why reveal one example: students learn from a concrete failure, and a new attempt gets new inputs anyway.
8. Points never go below 0 for a mission (hints can't make a mission negative) — enforce in the controller with a comment.

## 6. The worker runner (client) — `client/src/missions/runner.worker.js`

- Create with `new Worker(new URL('./runner.worker.js', import.meta.url), { type: 'module' })` (Vite pattern).
- Message in: `{ code, fnName, inputs, sampleTests?, libs: [] }`. Message out: `{ ok, outputs?, sampleResults?, logs, error? }`.
- Wrap student code with `new Function(...)` and pass `fetch, XMLHttpRequest, importScripts, self, postMessage` as `undefined` parameters so student code can't reach them by name. Comment honestly: "this is a speed bump, not a sandbox; it's fine because the code only ever runs in the student's own browser".
- `print(...)` and `console.log` captured into `logs` (max 50 lines).
- Libraries for bonus: `if (libs.includes('geolib')) geolib = await import('geolib')`, same for `mathjs` (`create(all)` → exposed as `math`).
- Main thread: `terminate()` the worker after **2000 ms** and show "Your code took too long. Is there a loop that never ends?"
- Outputs must survive `postMessage` (structured clone). Plain objects, numbers, strings, booleans only; otherwise error "Return plain data".

## 7. Aggregations (comment each stage — these ARE the lesson)

### 7.1 Mission leaderboard — reuse the Campus Arena shape
```
[ { $match: { missionPoints: { $gt: 0 } } },
  { $setWindowFields: { sortBy: { missionPoints: -1 }, output: { rank: { $rank: {} } } } },   // -1: MORE points is better (opposite of reaction time — point this out)
  { $facet: { top: [ { $limit: 20 }, { $project: { name: 1, missionPoints: 1, rank: 1 } } ],
              me:  [ { $match: { _id: userId } }, { $project: { _id: 0, rank: 1, points: '$missionPoints' } } ] } } ]
```

### 7.2 My progress per world — `$group` on MissionProgress
Join world numbers by passing an `{ missionId: world }` map built from the server registry, or keep it client-side from `catalog.js`. Prefer client-side (comment: the catalogue is static data; no need to store it in Mongo).

## 8. Client work

```
src/missions/runner.worker.js        // §6
src/missions/useRunner.js            // hook: run(code, fnName, inputs, libs) → Promise, with the 2 s timeout
src/pages/Missions.jsx               // M1: worlds from catalog.js; lesson rows; mission chips (✓ done / ▶ live / 🔒 soon); points + rank card; 🎮/🏢 filter
src/pages/MissionPlayer.jsx          // M2: see below
src/pages/Leaderboard.jsx            // EXTEND: tabs "Reaction game" | "Missions"
src/pages/Enovix.jsx                 // EXTEND (M7): below the existing lesson cards, "The full journey": every catalogue lesson by world; live → link; soon → greyed card + "Coming soon" badge + its mission names
src/pages/Home.jsx                   // EXTEND (M8): third card
src/App.jsx                          // routes /missions, /missions/:id (Protected, lazy like the others); NavLink "Missions"
src/styles.css                       // mission styles; reuse existing tokens and card styles
```

**MissionPlayer layout (top to bottom):**
1. Header: product badge (🎮 Campus Quest / 🏢 CampusOps), title, world, link to its lesson (or "Lesson coming soon" if the lesson is `soon`).
2. Story (bilingual, language toggle like Enovix, default Tamil).
3. **Preview canvas** (640×400 logical, responsive): runs `def.preview(ctx, fn, t, W, H)` on `requestAnimationFrame`. `fn` = the student's last function that **passed all sample tests** (compiled on the main thread for preview only); before that, `null`. The preview is the instant payoff: rain starts swaying, the character starts walking.
4. **Predict** (stage 1): options as buttons → `POST /predict` → correct/incorrect + points.
5. Stage tabs **Fill the gap · Write it · ⭐ Bonus** (Bonus tab only if `def.bonus`). Each tab loads its starter into a monospace `<textarea>` (Tab inserts 2 spaces, like CodeLab). Keep separate code per tab.
6. Buttons: **Run sample tests** (worker, `def.sampleTests`, shows a ✓/✗ table with input / expected / got; no server call, no points) and **Submit for points** (start → worker on hidden inputs → submit).
7. Hint ladder: "Get hint (−5)" → `POST /hint`; show hints accumulated so far.
8. Result: on pass → toast + existing trophy Lottie for the first completion of `write`; show points earned and new rank. On fail → the one example from the server, in a friendly box.

## 9. Points (already in each server reference file)

| Stage | Points |
|---|---|
| Predict (first time correct) | 10 |
| Fill the gap | 20 |
| Write it | 50 |
| ⭐ Bonus with a package | 20 (only missions with `bonus`) |
| First-try bonus (no hints, no failed attempts) | 10 |
| Each hint | −5 (mission total never below 0) |

## 10. Seed — EXTEND `server/utils/seed.js`
Give 4 demo students MissionProgress rows with a spread of stages and matching `missionPoints` (e.g. 145, 90, 60, 20) so the Missions leaderboard shows ranks on first demo.

## 11. Acceptance checklist
- [ ] `/missions` shows 7 worlds; 5 live missions open; everything else shows "Coming soon"
- [ ] `/enovix` lists all 42 lessons by world; only Probability opens
- [ ] `moveToward`: Fill with `cos` → sample tests ✓ → character walks in the preview → Submit → +20, rank updates
- [ ] Wrong fill (`sin`) → sample test ✗ table; Submit → 400-style fail response with one example
- [ ] `curl` submit with made-up outputs → fails; submit without start → 404; submit same passed attempt twice → 400
- [ ] Passing `write` twice never adds points twice (unique index + stage flags)
- [ ] `while(true){}` in the editor → "took too long" after 2 s, page stays responsive
- [ ] `isInsideCampus` bonus with geolib passes; bonus without `geolib.` in code fails the mustUse check
- [ ] 3 hints → −15 applied once; 4th hint → 400
- [ ] Missions leaderboard tab ranks seeded users; reaction-game tab unchanged

## 12. Out of scope (next sessions)
- Python missions (Pyodide in the same worker, `result = ...` convention from the Enovix code lab)
- The full Campus Quest and CampusOps products; missions will later plug into their "sockets" instead of preview canvases
- Weekly/section leaderboards, Aarambh sync, teacher review screen for stored `code`
- The sin & cos lessons A/B/C themselves (their missions are live already; lesson status stays `soon` until built)
