// src/services/AuthService.js
import ApiService from './ApiService';
import StorageService from './StorageService';
import { USER_TYPES } from '../utils/constants';
import Socio from '../models/Socio';

/**
 * Servicio de Autenticación
 * Principio: Single Responsibility - Solo maneja autenticación
 */
class AuthService {
  async loginSocio(dni, password) {
    const response = await ApiService.post('api/login', { dni, password });
    
    if (response.ok) {
      await StorageService.clear();
      await StorageService.setAuthToken(response.data.token);
      await StorageService.setAuthTipo(USER_TYPES.SOCIO);
      // Convertir los datos del socio a una instancia de Socio
      const socio = new Socio(response.data.socio);
      return { success: true, data: socio };
    }
    
    return { success: false, error: response.data.error };
  }

  async loginAdmin(username, password) {
    const response = await ApiService.post('api/login-admin', { username, password });
    
    if (response.ok) {
      await StorageService.clear();
      await StorageService.setAuthToken(response.data.token);
      await StorageService.setAuthTipo(USER_TYPES.ADMIN);
      return { success: true };
    }
    
    return { success: false, error: response.data.error };
  }

  async logout() {
    await StorageService.clear();
    return true;
  }

  async getStoredAuth() {
    const token = await StorageService.getAuthToken();
    const tipo = await StorageService.getAuthTipo();
    return { token, tipo };
  }

  async isAuthenticated() {
    const { token } = await this.getStoredAuth();
    return !!token;
  }

  async getAuthType() {
    return StorageService.getAuthTipo();
  }
}

export default new AuthService();