# SIN & COS LESSONS A · B · C — Implementation Spec (Session 4)
**Handoff document for Claude Code. Read fully before writing any code.**
Branch: `feature/campus-arena`. Builds on `MISSION-ENGINE-SPEC.md` and the existing Enovix lesson player.

## 0. Context & hard rules
- Three new lessons, each a complete class session: **Watch (≈5–7 min) → Try it yourself → Code lab → Quiz → Missions**. They replace the earlier single long sin & cos idea.
- Their missions (`moveToward`, `isInsideCampus`, `rainSway`) are **already live** in the mission engine. This session makes the lessons live and links the two.
- Same teaching-codebase rules as before: `// why` comments, existing conventions, bilingual `{ en, ta }`.
- **Allowed new deps: none.** geolib and mathjs are already client deps. Python packages load inside Pyodide at runtime (§4).
- Do not change the maths or wording in the provided content files. Style fixes only.

## 1. Files already provided — DO NOT rewrite their content

| Path | Contents |
|---|---|
| `client/src/lessons/sincos-a/` | `narration.json` (10 scenes, 31 beats, Tamil + English + `say` lines), `scenes.js`, `lab.js` (zone, throw, radians, mysin), `practice.js` (8 problems), `quiz.js` (5) |
| `client/src/lessons/sincos-b/` | same shape: 10 scenes, 30 beats; lab: steps, packages, direction, geofence; 8 problems; 5 quiz |
| `client/src/lessons/sincos-c/` | same shape: 9 scenes, 27 beats; lab: wave, rain, heartRate, power, season; 7 problems; 5 quiz |
| `client/src/components/Practice.jsx` | Practice problems UI: check within tolerance, hint, solution, "Run this code" |

Every `narration.json` has one story version, key **`main`**. Every `scenes.js` returns `{ draws, titleFrame, paper }`; the player must call `paper()` before each frame (LessonPlayer already does).

Verified before handover: all 29 scenes render in Chromium; every practice answer matches its own solution code (23/23); every lab experiment runs in JavaScript (with the real geolib/mathjs) **and** CPython (with numpy/geopy); geolib and the hand method agree on the geofence.

## 2. Registry — `client/src/lessons/index.js`
Register three lessons alongside `probability`:
```js
'sincos-a': { id, title: narration.title, breadcrumb: 'CSE › Mathematics for Computing › Trigonometry',
              narration, scenes: { main: createScenes }, defaultVersion: 'main',
              createLab, practice, quiz, next: 'sincos-b' },
'sincos-b': { …same…, prev: 'sincos-a', next: 'sincos-c' },
'sincos-c': { …same…, prev: 'sincos-b' },
```
`probability` gets `defaultVersion: 'B'` so its behaviour doesn't change.

## 3. Lesson page — EXTEND `client/src/pages/Lesson.jsx`
1. **Version selection:** replace the hard-coded `['A','B','C']` / `'B'` with: `?v=` if it is a key of `lesson.narration.versions`, else `lesson.defaultVersion`. Keep `?v=C` = code lab only **for probability** (pilot compatibility).
2. **Section order:** 1. Watch → 2. Try it yourself (`<Practice>` when `lesson.practice`) → 3. Code lab → 4. Check yourself → 5. **Missions for this lesson**.
3. **Missions section:** read the lesson's missions from `client/src/missions/catalog.js` (`allLessons.find(l => l.id === lesson.id).missions`); live ones link to `/missions/:id` with the product badge (🎮 / 🏢), soon ones show "Coming soon". This is the bridge from concept to mission.
4. **Prev / next:** buttons "← Part A" / "Part C →" from `lesson.prev` / `lesson.next`, at the bottom and under the player.
5. The page title/breadcrumb must not break for lessons without A/B versions (`lesson.narration.versions[v].label` may be an object: render with `t()`).

## 4. Code lab — EXTEND `client/src/components/CodeLab.jsx`
Experiments may now declare packages. Two optional fields per experiment:

| Field | Meaning | Implementation |
|---|---|---|
| `libs: ['mathjs','geolib']` | JS packages the code uses by name (`math`, `geolib`) | Before running, dynamic-import them on the main thread (`await import('geolib')`; mathjs → `create(all)` exposed as `math`) and pass as extra `new Function` parameters: `new Function('print', 'math', 'geolib', code)`. Cache after first load. |
| `pyPackages: ['numpy','geopy']` | Python packages the code imports | Before `runPythonAsync`: `numpy` → `await py.loadPackage('numpy')`; anything else → `await py.loadPackage('micropip')` then `await py.pyimport('micropip').install(name)`. Cache per session. Show "Loading numpy…" in the output box while it loads. |

- Show a small badge on the experiment card: "uses mathjs" / "uses geolib" / Python "uses numpy · geopy", so students see which parts are plain Math and which are packages. That contrast is the lesson.
- Every experiment in these lessons has both `code` (JS) and `py` (Python). Keep the existing JS/Python toggle.
- **Verify in the browser** that `micropip.install('geopy')` works under the pinned Pyodide v0.26.4 (it's pure Python + geographiclib). If it doesn't, show "geopy could not load in this browser; try the JavaScript version" rather than crashing; do not swap in a different package.

## 5. Catalogue — EDIT `client/src/missions/catalog.js`
Flip `sincos-a`, `sincos-b`, `sincos-c` to `status: 'live'` and add `route: '/enovix/sincos-a'` (etc.). Nothing else changes: Enovix and the mission map pick it up automatically.

## 6. Styles — `client/src/styles.css`
Add styles for Practice (`.prob`, `.prob-tag`, `.prob-in`, `.prob-fb.good/.bad`, `.prob-code`), the missions strip under a lesson, prev/next buttons, and the package badges. Reuse existing tokens.

## 7. Voice — no code change
`server/scripts/generateVoice.js` already loops over every `narration.json` and every version key. After review, run in `/server`:
```
npm run voice -- --lesson sincos-a --dry   # 62 clips, ~11,000 characters
npm run voice -- --lesson sincos-a
npm run voice -- --lesson sincos-b         # 60 clips, ~9,900 characters
npm run voice -- --lesson sincos-c         # 54 clips, ~7,400 characters
```
Audio lands in `client/public/audio/sincos-a/main/<lang>/<beat>.mp3`. Commit the MP3s and manifests.

## 8. Acceptance checklist
- [ ] `/enovix` shows sin & cos A, B, C as live; each opens
- [ ] Each lesson plays without errors in Tamil and English (captions only until voice is generated); "Part B →" / "← Part A" navigate
- [ ] Part A scene 4 pauses for the water-tank prediction; the answer resumes the lesson
- [ ] Practice: typing 20 in problem A1 → ✓; a wrong answer shows the hint; "Run this code" prints the value
- [ ] Code lab A "radians" runs in JS (mathjs loads on first run) and Python (numpy loads)
- [ ] Code lab B "packages" runs in JS (geolib) and Python (geopy via micropip, or the friendly fallback message)
- [ ] Code lab C "heartRate" prints 75 bpm; "power" prints RMS 229.8 V
- [ ] Missions section under Part B links to `/missions/isInsideCampus`
- [ ] Probability lesson unchanged: `?v=A`, `?v=B`, `?v=C` behave as before
- [ ] `npm run voice -- --lesson sincos-a --dry` lists 62 clips
