import { createContext, useContext, useState } from 'react';
import api, { tokenExpired } from '../api/axios';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    // A saved user with an expired token is not logged in, whatever
    // localStorage says. Clear it now so the route guard sends them to
    // Login up front instead of a 401 throwing them out mid-lesson.
    if (!saved || !token || tokenExpired(token)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
    try { return JSON.parse(saved); } catch { return null; }
  });

  const saveAuth = ({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    saveAuth(data);
  };

  // "Sign in with Google": the server verifies Google's token and answers
  // exactly like /auth/login, so saveAuth works unchanged.
  const googleLogin = async (credential, referralCode) => {
    const { data } = await api.post('/auth/google', { credential, referralCode });
    saveAuth(data);
  };

  const signup = async (payload) => {
    const { data } = await api.post('/auth/signup', payload);
    saveAuth(data);
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}
