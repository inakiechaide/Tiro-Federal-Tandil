// src/models/Socio.js
import User from './User';

/**
 * Modelo Socio (hereda de User)
 * Principio: Liskov Substitution - Puede sustituir a User
 */
class Socio extends User {
  constructor(data) {
    super(data);
    this.dni = data.dni;
    this.numeroSocio = data.numeroSocio || data.numero_socio;
    this.fechaVencimiento = data.fechaVencimiento || data.fecha_vencimiento;
    this.categoria = data.categoria || 'Titular';
    this.foto = data.foto || data.foto_url || 'https://via.placeholder.com/150';
    this.clu = data.clu || '';
    this.instructor_ita = data.instructor_ita !== undefined ? data.instructor_ita : null;
    this.instructor_itb = data.instructor_itb !== undefined ? data.instructor_itb : null;
    this.isVigente = this.calcularVigencia();
  }

  calcularVigencia() {
    if (this.isVigente !== undefined) return this.isVigente;
    return new Date(this.fechaVencimiento) >= new Date();
  }

  getFechaFormateada() {
    return new Date(this.fechaVencimiento).toLocaleDateString('es-AR');
  }

  getEstado() {
    return this.isVigente ? 'Vigente' : 'Vencido';
  }

  getEstadoColor() {
    return this.isVigente ? 'green' : 'red';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      dni: this.dni,
      numeroSocio: this.numeroSocio,
      fechaVencimiento: this.fechaVencimiento,
      categoria: this.categoria,
      foto: this.foto,
      clu: this.clu,
      instructor_ita: this.instructor_ita,
      instructor_itb: this.instructor_itb,
      isVigente: this.isVigente
    };
  }

  // Método estático para crear desde respuesta de API
  static fromApiResponse(data) {
    return new Socio({
      id: data.id,
      dni: data.dni,
      nombre: data.nombre,
      apellido: data.apellido,
      numeroSocio: data.numeroSocio || data.numero_socio,
      fechaVencimiento: data.fechaVencimiento || data.fecha_vencimiento,
      categoria: data.categoria,
      foto: data.foto || data.foto_url,
      clu: data.clu,
      instructor_ita: data.instructor_ita !== undefined ? data.instructor_ita : null,
      instructor_itb: data.instructor_itb !== undefined ? data.instructor_itb : null,
      isVigente: data.isVigente || data.is_vigente || new Date(data.fechaVencimiento || data.fecha_vencimiento) >= new Date()
    });
  }
}

export default Socio;