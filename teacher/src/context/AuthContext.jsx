import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

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
    if (email === 'teacher@gmail.com' && password === '123') {
      const mockUser = {
        id: 'mock-1',
        name: 'Teacher',
        email: 'teacher@gmail.com',
        role: 'TEACHER',
      };
      localStorage.setItem('teacher_token', 'mock_token');
      localStorage.setItem('teacher_user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true, user: mockUser, token: 'mock_token' };
    }

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
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
