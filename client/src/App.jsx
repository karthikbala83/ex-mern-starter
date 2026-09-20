import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Notes from './pages/Notes.jsx';
import Admin from './pages/Admin.jsx';
import Game from './pages/Game.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Feedback from './pages/Feedback.jsx';
import NotificationBell from './components/NotificationBell.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

//import BadEffect from './pages/BadEffect.jsx';

// Route guards — the frontend half of protection.
// (The API enforces it too. Never trust only the frontend.)
function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}
function AdminOnly({ children }) {
  const { user } = useAuth();
  return user?.role === 'admin' ? children : <Navigate to="/game" />;
}

export default function App() {
  const { user, logout } = useAuth();
  // ToastProvider wraps EVERYTHING, including the nav — the bell lives in the
  // navbar and calls useToast(), so it has to sit inside the provider's tree.
  return (
    <ToastProvider>
      <nav className="nav">
        <span className="brand">Campus Arena</span>
        <div>
          {user ? (
            <>
              <Link to="/game">Game</Link>
              <Link to="/leaderboard">Leaderboard</Link>
              <Link to="/notes">Notes</Link>
              <Link to="/feedback">Feedback</Link>
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
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
        <Routes>
          <Route path="/" element={<Navigate to={user ? '/game' : '/login'} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/notes" element={<Protected><Notes /></Protected>} />
          <Route path="/game" element={<Protected><Game /></Protected>} />
          <Route path="/leaderboard" element={<Protected><Leaderboard /></Protected>} />
          <Route path="/feedback" element={<Protected><Feedback /></Protected>} />
          <Route path="/admin" element={<AdminOnly><Admin /></AdminOnly>} />
          {/* <Route path="/bad-effect" element={<Protected><BadEffect /></Protected>} /> */}
        </Routes>
      </main>

      {/* ---------------------------------------------------------------
          Site footer. It lives HERE — outside <Routes> — so it renders
          once and shows on every page, including Login and Signup.
          Putting it inside each page component would mean copying it
          nine times and forgetting it on the tenth.

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
        <a href="https://saravonix.com" target="_blank" rel="noopener">
          Saravonix Technologies
        </a>
      </footer>
    </ToastProvider>
  );
}
