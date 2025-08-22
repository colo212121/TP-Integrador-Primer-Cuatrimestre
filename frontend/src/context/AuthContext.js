import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiPost } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('token');
        if (saved) {
          setToken(saved);
          // Opcional: verificar si el token sigue siendo válido
          // const userData = await apiGet('/user/profile', true);
          // setUser(userData);
        }
      } catch (error) {
        console.error('Error al cargar token guardado:', error);
        // Si hay error, limpiamos el token inválido
        await AsyncStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (username, password) => {
    setLoginLoading(true);
    try {
      const res = await apiPost('/user/login', { username, password });
      if (res?.token) {
        await AsyncStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.user || { username });
        return { success: true };
      } else {
        throw new Error(res?.message || 'Error de login');
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw new Error(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoginLoading(false);
    }
  }, []);

  const register = useCallback(async ({ first_name, last_name, username, password }) => {
    setRegisterLoading(true);
    try {
      const res = await apiPost('/user/register', { first_name, last_name, username, password });
      return { success: true, message: res.message || 'Usuario registrado exitosamente' };
    } catch (error) {
      console.error('Error en registro:', error);
      throw new Error(error.message || 'Error al registrar usuario. Intenta nuevamente.');
    } finally {
      setRegisterLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aún limpiamos el estado local aunque falle AsyncStorage
      setToken(null);
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({ 
    token, 
    user,
    login, 
    register, 
    logout, 
    loading,
    loginLoading,
    registerLoading
  }), [token, user, loading, loginLoading, registerLoading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe ser usado dentro de AuthProvider');
  return ctx;
}


