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

// If the token expires, kick the user back to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config.url.includes('/auth/')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
