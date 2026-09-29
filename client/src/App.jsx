import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Link, NavLink } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import NotificationBell from './components/NotificationBell.jsx';

// ---- Eager: everything needed to sign in, plus the landing page ----
// These are tiny and every visitor needs them, so splitting them would
// only add a network round trip.
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Home from './pages/Home.jsx';

// ---------------------------------------------------------------
// TWO PRODUCTS, ONE LOGIN.
//
//   /game, /leaderboard   -> Campus Arena  (the "Fun Game" tab)
//   /enovix/*             -> Enovix        (the "Learning with Fun" tab)
//
// Each half is lazy(): React fetches that section's JavaScript only when
// someone actually opens it. A student who only wants lessons never
// downloads GSAP, Lottie or the game; a student who only wants the game
// never downloads the lesson scenes or narration. That is what keeps the
// two from slowing each other down — they share an account, not a bundle.
//
// The trade: a lazy route needs a <Suspense> fallback above it, because
// there is now a real moment where the code has not arrived yet.
// ---------------------------------------------------------------

// --- Campus Arena ---
const Game        = lazy(() => import('./pages/Game.jsx'));
const Leaderboard = lazy(() => import('./pages/Leaderboard.jsx'));
const Notes       = lazy(() => import('./pages/Notes.jsx'));
const Feedback    = lazy(() => import('./pages/Feedback.jsx'));

// --- Enovix ---
const Enovix         = lazy(() => import('./pages/Enovix.jsx'));
const Lesson         = lazy(() => import('./pages/Lesson.jsx'));
const LessonFeedback = lazy(() => import('./pages/LessonFeedback.jsx'));

// --- Admin (heaviest, and only a handful of people ever load it) ---
const Admin         = lazy(() => import('./pages/Admin.jsx'));
const LessonResults = lazy(() => import('./pages/LessonResults.jsx'));

// ---------------------------------------------------------------
// Where the footer link points.
//
// The ?utm_* parameters are how Saravonix tells WHICH project sent a
// visitor. Google Analytics (and every other analytics tool) reads these
// four names by convention:
//   utm_source   — who sent them        (this app)
//   utm_medium   — what kind of link    (a footer link, not an ad or email)
//   utm_campaign — which batch/effort   (so next year's cohort is separate)
//
// Why bother when we already keep the Referer header? Because referrers
// are fragile: privacy modes, some browsers, and any http -> https hop
// drop them silently. UTM tags live in the URL itself, so they survive.
// Referer and UTM together = belt and braces.
//
// One constant, not a string inline in the JSX, so there is exactly one
// place to edit when the campaign name changes.
// ---------------------------------------------------------------
const SARAVONIX_URL =
  'https://saravonix.com/?utm_source=campus-arena&utm_medium=footer&utm_campaign=student-projects';

// Route guards — the frontend half of protection.
// (The API enforces it too. Never trust only the frontend.)
function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}
function AdminOnly({ children }) {
  const { user } = useAuth();
  return user?.role === 'admin' ? children : <Navigate to="/home" />;
}

export default function App() {
  const { user, logout } = useAuth();

  return (
    <ToastProvider>
      <nav className="nav">
        <span className="brand">Campus Arena</span>
        <div>
          {user ? (
            <>
              {/* NavLink, not Link: it knows when it is the active route,
                  so the current tab can highlight itself. */}
              <NavLink to="/home">Home</NavLink>
              <NavLink to="/game">Fun Game</NavLink>
              <NavLink to="/enovix">Enovix</NavLink>
              <NavLink to="/feedback">Feedback</NavLink>
              {user.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
              <NotificationBell />
              <button className="link-btn" onClick={logout}>Logout ({user.name})</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </nav>

      <main className="container">
        {/* One Suspense around the whole route tree: any lazy page shows
            this while its chunk downloads. */}
        <Suspense fallback={<p className="muted">Loading…</p>}>
          <Routes>
            <Route path="/" element={<Navigate to={user ? '/home' : '/login'} />} />

            {/* ---- signed out ---- */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* ---- the fork ---- */}
            <Route path="/home" element={<Protected><Home /></Protected>} />

            {/* ---- tab 1: Campus Arena ---- */}
            <Route path="/game" element={<Protected><Game /></Protected>} />
            <Route path="/leaderboard" element={<Protected><Leaderboard /></Protected>} />
            <Route path="/notes" element={<Protected><Notes /></Protected>} />
            <Route path="/feedback" element={<Protected><Feedback /></Protected>} />

            {/* ---- tab 2: Enovix ---- */}
            <Route path="/enovix" element={<Protected><Enovix /></Protected>} />
            <Route path="/enovix/check" element={<Protected><LessonFeedback /></Protected>} />
            <Route path="/enovix/:id" element={<Protected><Lesson /></Protected>} />

            {/* ---- admin ---- */}
            <Route path="/admin" element={<AdminOnly><Admin /></AdminOnly>} />
            <Route path="/admin/lesson-results" element={<AdminOnly><LessonResults /></AdminOnly>} />

            {/* Anything else: send them somewhere real rather than a blank page. */}
            <Route path="*" element={<Navigate to={user ? '/home' : '/login'} />} />
          </Routes>
        </Suspense>
      </main>

      {/* ---------------------------------------------------------------
          Site footer. It lives HERE — outside <Routes> — so it renders
          once and shows on every page, including Login and Signup.

          rel="noopener" closes a real security hole: without it, the
          page we open can reach back via window.opener and redirect
          this tab somewhere else (reverse tabnabbing).

          Note it is NOT "noopener noreferrer" — the usual copy-paste.
          `noreferrer` strips the Referer header, which would make every
          one of these visits show up as "direct" in Saravonix's
          analytics. Keeping the referrer is the whole point of the link.
          --------------------------------------------------------------- */}
      <footer className="site-footer">
        Supported By{' '}
        <a href={SARAVONIX_URL} target="_blank" rel="noopener">
          Saravonix Technologies
        </a>
      </footer>
    </ToastProvider>
  );
}
