# Lesson feedback module (Probability pilot)

Adds a before → lesson → after feedback flow to the MERN starter, plus an admin results page.

## Files
| File | What it does |
|---|---|
| `server/models/Feedback.js` | One document per student per lesson: `pre`, `post`, `rating` sub-documents, unique index on `{user, lesson}` |
| `server/controllers/feedbackController.js` | Questions (answers stay on the server), pre/post submit with validation, `$facet` summary for admin |
| `server/routes/feedbackRoutes.js` | `/questions`, `/mine`, `/pre`, `/post`, `/summary` (admin) |
| `server/server.js` | One new line mounting `/api/feedback` behind `trackActivity` |
| `client/src/pages/Feedback.jsx` | Student flow |
| `client/src/pages/FeedbackResults.jsx` | Admin comparison table, auto-refresh every 15 s |
| `client/src/App.jsx`, `client/src/styles.css` | Routes, nav links, a few styles |

## Before the pilot
1. **Share the three lesson links publicly.** Claude artifact links are private until shared. Open each one, choose Share, and allow anyone with the link to view.
2. Check the three URLs in `VERSIONS` inside `feedbackController.js`.
3. Deploy as usual (Render + Vercel). No new packages or env vars.

## Running it in class
- Give each section its own link: `https://<your-app>/feedback?v=A`, `?v=B`, `?v=C`.
- Students sign up / log in, answer 3 questions, open the lesson, then answer the same 3 plus ratings.
- Watch results live at `/admin/feedback` (admin login).

## Homework ideas for students
1. Add a `department` facet to the summary (which branch gained most?).
2. Export the summary as CSV.
3. Make `LESSON` and `QUESTIONS` come from a `Lesson` collection instead of constants — the first step toward the full Course → Subject → Lesson app.
