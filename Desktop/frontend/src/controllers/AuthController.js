// src/controllers/AuthController.js
import AuthService from '../services/AuthService';
import { USER_TYPES, VIEWS } from '../utils/constants';

/**
 * Controlador de Autenticación
 * Principio: Dependency Inversion - Depende de abstracción (AuthService)
 */
class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async handleLoginSocio(dni, password) {
    // Validaciones
    if (!dni || !password) {
      return { success: false, error: 'Por favor completá todos los campos' };
    }
    
    if (dni.length < 7) {
      return { success: false, error: 'El DNI debe tener al menos 7 dígitos' };
    }

    return await this.authService.loginSocio(dni, password);
  }

  async handleLoginAdmin(username, password) {
    // Validaciones
    if (!username || !password) {
      return { success: false, error: 'Por favor completá todos los campos' };
    }

    return await this.authService.loginAdmin(username, password);
  }

  async handleLogout() {
    return await this.authService.logout();
  }

  async checkStoredAuth() {
    const { token, tipo } = await this.authService.getStoredAuth();
    
    if (token && tipo) {
      if (tipo === USER_TYPES.ADMIN) {
        return { authenticated: true, view: VIEWS.ADMIN, isAdmin: true };
      } else {
        return { authenticated: true, view: VIEWS.CARNET, isAdmin: false };
      }
    }
    
    return { authenticated: false, view: VIEWS.LOGIN };
  }
}

export default new AuthController(AuthService);