// One axios instance for the whole app.
// Interceptor attaches the JWT to every request automatically.
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE_URL });

// ---------------------------------------------------------------
// warmUpApi — poke the server awake BEFORE the user needs it.
//
// Render's free tier stops the instance after 15 minutes of no traffic,
// and the next request pays ~50s to start it again. The trick is WHERE
// that wait lands. The login page is static and served from Netlify's
// CDN, so it appears instantly — and then the student spends 10-30
// seconds typing an email and a password. If we start the server during
// those seconds, most or all of the 50s is already spent by the time
// they press Login.
//
// We hit the server ROOT (GET /), not an /api route: it needs no token,
// touches no database, and exists purely to answer "I'm alive".
//
// Deliberately plain fetch, not our axios instance: this call is allowed
// to fail (the server may still be booting) and must never trip the 401
// interceptor below, which would bounce a half-logged-in user to /login.
// Nothing awaits it and nothing reads its result — the side effect IS
// the point.
// ---------------------------------------------------------------
export const API_ROOT = BASE_URL.replace(/\/api\/?$/, '');
export const warmUpApi = () => { fetch(`${API_ROOT}/`).catch(() => {}); };

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------------------------------------------------------------
// Expired logins.
// A JWT carries its own expiry ("exp", seconds since 1970) in its middle
// part, readable without the secret. Checking it when the app starts means
// a student coming back the next day goes to Login BEFORE opening a
// lesson, not halfway through one when some background request gets a 401.
// (Reading exp is not verifying the token: the server still does that.)
// ---------------------------------------------------------------
export function tokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' && payload.exp * 1000 < Date.now() + 60_000;   // a minute's margin
  } catch {
    return true;   // unreadable token: treat as logged out
  }
}

// Where to come back to after logging in again. sessionStorage, so it is
// per tab and forgotten when the tab closes.
const RETURN_KEY = 'returnTo';
export const rememberReturnPath = (path) => {
  if (path && !/^\/(login|signup|forgot-password|reset-password)/.test(path)) {
    try { sessionStorage.setItem(RETURN_KEY, path); } catch { /* storage blocked */ }
  }
};
export const takeReturnPath = () => {
  try { const p = sessionStorage.getItem(RETURN_KEY); sessionStorage.removeItem(RETURN_KEY); return p; } catch { return null; }
};

// If the token expires mid-session, send the student to Login with a
// reason, and bring them back to the same page afterwards.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config.url.includes('/auth/')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      rememberReturnPath(window.location.pathname + window.location.search);
      window.location.href = '/login?expired=1';
    }
    return Promise.reject(err);
  }
);

export default api;
