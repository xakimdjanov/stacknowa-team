import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('university_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('university_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('/auth/me');
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('university_user', JSON.stringify(res.data.user));
      } else {
        setUser(null);
        localStorage.removeItem('university_token');
        localStorage.removeItem('university_user');
      }
    } catch (err) {
      console.log("Check auth session:", err.message);
      setUser(null);
      localStorage.removeItem('university_token');
      localStorage.removeItem('university_user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.token) {
        localStorage.setItem('university_token', res.data.token);
        localStorage.setItem('university_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
      }
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const updateUser = (newData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newData };
      localStorage.setItem('university_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem('university_token');
    localStorage.removeItem('university_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updateUser, checkAuth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
