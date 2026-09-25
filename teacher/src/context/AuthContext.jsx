import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { signInWithGoogle } from '../firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await api.get('/plans/my-status');
      if (res.data?.user) {
        localStorage.setItem('teacher_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
      }
    } catch (e) {
      // Offline or network error
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('teacher_user');
    const token = localStorage.getItem('teacher_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      refreshUser(); // Serverdan eng so'nggi Pro holatini tekshiradi
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      if (res.data.user.role !== 'TEACHER' && res.data.user.role !== 'ADMIN') {
        throw new Error("Ushbu portal faqat o'qituvchilar uchun mo'ljallangan!");
      }
      localStorage.setItem('teacher_token', res.data.token);
      localStorage.setItem('teacher_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    }
  };

  const loginWithGoogle = async () => {
    const firebaseUser = await signInWithGoogle();
    const res = await api.post('/auth/google', {
      email: firebaseUser.email,
      name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
      role: 'TEACHER',
    });
    if (res.data.success) {
      if (res.data.user.role !== 'TEACHER' && res.data.user.role !== 'ADMIN') {
        throw new Error("Ushbu portal faqat o'qituvchilar uchun mo'ljallangan!");
      }
      localStorage.setItem('teacher_token', res.data.token);
      localStorage.setItem('teacher_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', {
      ...userData,
      role: 'TEACHER',
    });
    if (res.data.success) {
      localStorage.setItem('teacher_token', res.data.token);
      localStorage.setItem('teacher_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('teacher_token');
    localStorage.removeItem('teacher_user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
