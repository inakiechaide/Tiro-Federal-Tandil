// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import AuthController from '../controllers/AuthController';
import AuthService from '../services/AuthService';
import SocioController from '../controllers/SocioController';
import { VIEWS } from '../utils/constants';

/**
 * Hook personalizado para autenticación
 * Principio: Interface Segregation - Interfaz específica para auth
 */
export const useAuth = () => {
  const [view, setView] = useState(VIEWS.LOGIN);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const { token, tipo } = await AuthService.getStoredAuth();
      setToken(token);
      
      if (token && tipo) {
        const authState = await AuthController.checkStoredAuth();
        
        if (authState.authenticated) {
          setIsAdmin(authState.isAdmin);
          setView(authState.view);
          
          if (!authState.isAdmin) {
            await loadCarnet();
          }
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      await handleLogout();
    } finally {
      setInitialized(true);
    }
  };

  const loadCarnet = async () => {
    const result = await SocioController.loadCarnet();
    if (result.success) {
      setUserData(result.data);
    } else {
      await handleLogout();
    }
  };

  const handleLoginSocio = async (dni, password) => {
    setLoading(true);
    try {
      const result = await AuthController.handleLoginSocio(dni, password);
      
      if (result.success) {
        const { token } = await AuthService.getStoredAuth();
        setToken(token);
        setUserData(result.data);
        setIsAdmin(false);
        setView(VIEWS.CARNET);
      }
      
      return result;
    } finally {
      setLoading(false);
    }
  };

  const handleLoginAdmin = async (username, password) => {
    setLoading(true);
    try {
      const result = await AuthController.handleLoginAdmin(username, password);
      
      if (result.success) {
        const { token } = await AuthService.getStoredAuth();
        setToken(token);
        setIsAdmin(true);
        setUserData(null);
        setView(VIEWS.ADMIN);
      }
      
      return result;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AuthController.handleLogout();
    setToken(null);
    setUserData(null);
    setIsAdmin(false);
    setView(VIEWS.LOGIN);
  };

  return {
    view,
    setView,
    isAdmin,
    userData,
    loading,
    initialized,
    token,
    handleLoginSocio,
    handleLoginAdmin,
    handleLogout
  };
};