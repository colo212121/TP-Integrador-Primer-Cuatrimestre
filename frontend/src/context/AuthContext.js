import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiPost } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('token');
      if (saved) setToken(saved);
      setLoading(false);
    })();
  }, []);

  const login = async (username, password) => {
    const res = await apiPost('/user/login', { username, password });
    if (res?.token) {
      await AsyncStorage.setItem('token', res.token);
      setToken(res.token);
    } else {
      throw new Error(res?.message || 'Error de login');
    }
  };

  const register = async ({ first_name, last_name, username, password }) => {
    await apiPost('/user/register', { first_name, last_name, username, password });
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
  };

  const value = useMemo(() => ({ token, login, register, logout, loading }), [token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


