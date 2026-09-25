import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { signInWithGoogle } from '../firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('student_token');
      const savedUser = localStorage.getItem('student_user');
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('student_user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    if (user.role !== 'STUDENT') {
      throw new Error("Ushbu portal faqat talabalar uchun mo'ljallangan!");
    }
    localStorage.setItem('student_token', token);
    localStorage.setItem('student_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const loginWithGoogle = async () => {
    const firebaseUser = await signInWithGoogle();
    const res = await api.post('/auth/google', {
      email: firebaseUser.email,
      name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
      role: 'STUDENT',
    });
    const { token, user } = res.data;
    if (user.role !== 'STUDENT') {
      throw new Error("Ushbu portal faqat talabalar uchun mo'ljallangan!");
    }
    localStorage.setItem('student_token', token);
    localStorage.setItem('student_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { 
      name, 
      email, 
      password,
      role: 'STUDENT'
    });
    const { token, user } = res.data;
    localStorage.setItem('student_token', token);
    localStorage.setItem('student_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
