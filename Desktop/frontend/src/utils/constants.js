// src/utils/constants.js

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  AUTH_TIPO: 'auth_tipo'
};

export const USER_TYPES = {
  SOCIO: 'socio',
  ADMIN: 'admin'
};

export const VIEWS = {
  LOGIN: 'login',
  CARNET: 'carnet',
  SCANNER: 'scanner',
  ADMIN: 'admin'
};

export const CATEGORIAS = {
  SOCIO: 'Socio',
  VITALICIO: 'Vitalicio',
  INSTRUCTOR_ITA: 'Instructor ITA',
  INSTRUCTOR_ITB: 'Instructor ITB'
};