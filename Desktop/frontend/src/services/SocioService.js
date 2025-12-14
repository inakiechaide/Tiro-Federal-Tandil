// src/services/SocioService.js
import ApiService from './ApiService';
import StorageService from './StorageService';
import Socio from '../models/Socio';

/**
 * Servicio para operaciones de Socios
 * Principio: Single Responsibility - Solo maneja operaciones de socios
 */
class SocioService {
  async getCarnet() {
    const token = await StorageService.getAuthToken();
    const response = await ApiService.get('api/carnet', token);
    
    if (response.ok) {
      return { success: true, data: Socio.fromApiResponse(response.data) };
    }
    return { success: false, error: 'Error al cargar carnet' };
  }

  async verificarSocio(numeroSocio) {
    const token = await StorageService.getAuthToken();
    const response = await ApiService.post('api/verificar', { numeroSocio }, token);
    
    if (response.ok) {
      return {
        success: true,
        valid: response.data.valido,
        socio: response.data.socio ? Socio.fromApiResponse(response.data.socio) : null,
        mensaje: response.data.mensaje
      };
    }
    return { success: false, error: 'Error al verificar' };
  }

  async getAllSocios(search = '') {
    try {
      const token = await StorageService.getAuthToken();
      let endpoint = 'api/admin/socios';
      
      // Si hay un término de búsqueda, lo agregamos como query param
      if (search && search.trim() !== '') {
        endpoint += `?search=${encodeURIComponent(search.trim())}`;
      }

      const response = await ApiService.get(endpoint, token);
      
      if (response.ok) {
        return {
          success: true,
          data: Array.isArray(response.data) 
            ? response.data.map(s => Socio.fromApiResponse(s))
            : []
        };
      }
      return { 
        success: false, 
        error: response.data?.error || 'Error al cargar socios' 
      };
    } catch (error) {
      console.error('Error en getAllSocios:', error);
      return { 
        success: false, 
        error: 'Error de conexión con el servidor' 
      };
    }
  }

  async createSocio(socioData, fotoFile = null) {
    const token = await StorageService.getAuthToken();
    
    // Si hay foto, usar FormData
    if (fotoFile) {
      const formData = new FormData();
      formData.append('dni', socioData.dni);
      formData.append('nombre', socioData.nombre);
      formData.append('apellido', socioData.apellido);
      formData.append('numeroSocio', socioData.numeroSocio);
      formData.append('clu', socioData.clu);
      formData.append('password', socioData.password);
      formData.append('fechaVencimiento', socioData.fechaVencimiento);
      formData.append('categoria', socioData.categoria);
      formData.append('foto', fotoFile);
      
      const response = await ApiService.post('api/admin/socios', formData, token);
      
      if (response.ok) {
        return { success: true, mensaje: response.data.mensaje };
      }
      return { success: false, error: response.data.error };
    }
    
    // Sin foto, enviar JSON normal
    // Asegurarse de que el CLU esté incluido
    const socioDataWithClu = {
      ...socioData,
      clu: socioData.clu || ''
    };
    const response = await ApiService.post('api/admin/socios', socioDataWithClu, token);
    
    if (response.ok) {
      return { success: true, mensaje: response.data.mensaje };
    }
    return { success: false, error: response.data.error };
  }

  async updateSocio(id, socioData, fotoFile = null) {
    const token = await StorageService.getAuthToken();
    
    // Si hay foto, usar FormData
    if (fotoFile) {
      const formData = new FormData();
      formData.append('nombre', socioData.nombre);
      formData.append('apellido', socioData.apellido);
      formData.append('fechaVencimiento', socioData.fechaVencimiento);
      formData.append('categoria', socioData.categoria);
      if (socioData.password) {
        formData.append('password', socioData.password);
      }
      if (socioData.clu) {
        formData.append('clu', socioData.clu);
      }
      // Agregar campos de instructor
      if (socioData.instructor_ita !== undefined) {
        formData.append('instructor_ita', socioData.instructor_ita || null);
      }
      if (socioData.instructor_itb !== undefined) {
        formData.append('instructor_itb', socioData.instructor_itb || null);
      }
      formData.append('foto', fotoFile);
      
      const response = await ApiService.put(`api/admin/socios/${id}`, formData, token);
      
      if (response.ok) {
        return { success: true, mensaje: response.data.mensaje };
      }
      return { success: false, error: response.data.error };
    }
    
    // Sin foto, enviar JSON normal
    const updateData = { ...socioData };
    
    // Asegurarse de que los campos opcionales estén incluidos correctamente
    if (socioData.clu) {
      updateData.clu = socioData.clu;
    }
    
    // Asegurarse de que los campos de instructor estén correctamente definidos
    updateData.instructor_ita = socioData.instructor_ita || null;
    updateData.instructor_itb = socioData.instructor_itb || null;
    
    const response = await ApiService.put(
      `api/admin/socios/${id}`, 
      updateData, 
      token
    );
    
    if (response.ok) {
      return { success: true, mensaje: response.data.mensaje };
    }
    return { success: false, error: response.data.error };
  }

  async deleteSocio(id) {
    const token = await StorageService.getAuthToken();
    const response = await ApiService.delete(`api/admin/socios/${id}`, token);
    
    if (response.ok) {
      return { success: true };
    }
    return { success: false, error: 'Error al eliminar' };
  }
}

export default new SocioService();