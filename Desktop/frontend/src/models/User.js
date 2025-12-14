// src/models/User.js

/**
 * Modelo base Usuario
 * Principio: Open/Closed - Abierto para extensión (herencia)
 */
class User {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.apellido = data.apellido;
  }

  getNombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      apellido: this.apellido
    };
  }
}

export default User;