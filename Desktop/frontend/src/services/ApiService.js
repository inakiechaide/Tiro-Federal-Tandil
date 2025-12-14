// src/services/ApiService.js
import { API_URL } from '../utils/constants';

/**
 * Servicio base para comunicación con API
 * Principio: Single Responsibility - Solo maneja comunicación HTTP
 */
class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

      
      // Si no es FormData, agregar Content-Type: application/json
      const headers = { ...options.headers };
      if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }
      
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();
      
      return {
        ok: response.ok,
        status: response.status,
        data
      };
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      return {
        ok: false,
        status: 0,
        data: { error: 'Error de conexión con el servidor' }
      };
    }
  }

  async get(endpoint, token = null) {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    return this.request(endpoint, { method: 'GET', headers });
  }

  async post(endpoint, body, token = null) {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  }

  async put(endpoint, body, token = null) {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    return this.request(endpoint, {
      method: 'PUT',
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  }

  async delete(endpoint, token = null) {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    return this.request(endpoint, { method: 'DELETE', headers });
  }
}

export default new ApiService(API_URL);