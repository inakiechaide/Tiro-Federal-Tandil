// src/services/StorageService.js
import { STORAGE_KEYS } from '../utils/constants';

// Verificar si estamos en el navegador
const isBrowser = typeof window !== 'undefined';
const useNativeStorage = isBrowser && window.storage !== undefined;

/**
 * Servicio para gestionar el almacenamiento persistente
 * Usa window.storage si está disponible, de lo contrario usa localStorage
 */
class StorageService {
  async get(key) {
    try {
      if (useNativeStorage) {
        const result = await window.storage.get(key);
        return result ? result.value : null;
      } else if (isBrowser) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
      return null;
    } catch (error) {
      console.error(`Error reading key ${key}:`, error);
      return null;
    }
  }

  async set(key, value) {
    try {
      if (useNativeStorage) {
        await window.storage.set(key, value);
      } else if (isBrowser) {
        localStorage.setItem(key, JSON.stringify(value));
      }
      return true;
    } catch (error) {
      console.error(`Error saving key ${key}:`, error);
      return false;
    }
  }

  async delete(key) {
    try {
      if (useNativeStorage) {
        await window.storage.delete(key);
      } else if (isBrowser) {
        localStorage.removeItem(key);
      }
      return true;
    } catch (error) {
      console.error(`Error deleting key ${key}:`, error);
      return false;
    }
  }

  async clear() {
    try {
      if (useNativeStorage) {
        const keys = Object.values(STORAGE_KEYS);
        for (const key of keys) {
          await this.delete(key);
        }
      } else if (isBrowser) {
        localStorage.clear();
      }
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  // Métodos específicos para auth
  async getAuthToken() {
    return this.get(STORAGE_KEYS.AUTH_TOKEN);
  }

  async setAuthToken(token) {
    return this.set(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  async getAuthTipo() {
    return this.get(STORAGE_KEYS.AUTH_TIPO);
  }

  async setAuthTipo(tipo) {
    return this.set(STORAGE_KEYS.AUTH_TIPO, tipo);
  }
}

export default new StorageService();