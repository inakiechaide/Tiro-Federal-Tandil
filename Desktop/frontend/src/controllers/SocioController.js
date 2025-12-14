// src/controllers/SocioController.js
import SocioService from '../services/SocioService';

/**
 * Controlador de Socios
 * Principio: Dependency Inversion - Depende de abstracción (SocioService)
 */
class SocioController {
  constructor(socioService) {
    this.socioService = socioService;
  }

  async loadCarnet() {
    return await this.socioService.getCarnet();
  }

  async verificarCarnet(numeroSocio) {
    if (!numeroSocio || !numeroSocio.trim()) {
      return { success: false, error: 'Número de socio inválido' };
    }
    return await this.socioService.verificarSocio(numeroSocio);
  }

  async loadAllSocios(searchTerm = '') {
    return await this.socioService.getAllSocios(searchTerm);
  }

  // 📸 Agregado parámetro fotoFile
  async createSocio(formData, fotoFile = null) {
    // Validaciones
    if (!formData.nombre || !formData.apellido || !formData.numeroSocio || !formData.fechaVencimiento) {
      return {
        success: false,
        error: 'Por favor completá todos los campos obligatorios'
      };
    }

    if (!formData.dni || formData.dni.length < 7) {
      return {
        success: false,
        error: 'El DNI debe tener al menos 7 dígitos'
      };
    }

    if (!formData.password) {
      return {
        success: false,
        error: 'La contraseña es obligatoria'
      };
    }

    if (formData.password.length < 4) {
      return {
        success: false,
        error: 'La contraseña debe tener al menos 4 caracteres'
      };
    }

    // 📸 Pasar el archivo de foto al servicio
    return await this.socioService.createSocio(formData, fotoFile);
  }

  // 📸 Agregado parámetro fotoFile
  async updateSocio(id, formData, fotoFile = null) {
    // Validaciones
    if (!formData.nombre || !formData.apellido || !formData.numeroSocio || !formData.fechaVencimiento) {
      return {
        success: false,
        error: 'Por favor completá todos los campos obligatorios'
      };
    }

    if (formData.password && formData.password.length < 4) {
      return {
        success: false,
        error: 'La contraseña debe tener al menos 4 caracteres'
      };
    }

    // No enviar password si está vacío en edición
    const dataToSend = { ...formData };
    if (!dataToSend.password) {
      delete dataToSend.password;
    }

    // 📸 Pasar el archivo de foto al servicio
    return await this.socioService.updateSocio(id, dataToSend, fotoFile);
  }

  async deleteSocio(id) {
    return await this.socioService.deleteSocio(id);
  }
}

export default new SocioController(SocioService);