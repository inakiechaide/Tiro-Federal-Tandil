// src/components/SocioForm.jsx
import React, { useState, useRef } from 'react';
import { Save, Upload, X } from 'lucide-react';
import { CATEGORIAS } from '../utils/constants';

/**
 * Componente formulario de socio
 */
const SocioForm = ({ formData, editingUser, loading, onSave, onCancel, onChange }) => {
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que sea imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida');
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no puede superar los 5MB');
        return;
      }

      setFotoFile(file);

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFoto = () => {
    setFotoFile(null);
    setFotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    onSave(fotoFile);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">
        {editingUser ? 'Editar Socio' : 'Nuevo Socio'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            DNI (sin puntos) {!editingUser && <span className="text-red-600">*</span>}
          </label>
          <input
            type="text"
            value={formData.dni}
            onChange={(e) => onChange({...formData, dni: e.target.value.replace(/\D/g, '')})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength="8"
            disabled={!!editingUser}
            required={!editingUser}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Socio <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={formData.numeroSocio}
            onChange={(e) => onChange({...formData, numeroSocio: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) => onChange({...formData, nombre: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Apellido <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={formData.apellido}
            onChange={(e) => onChange({...formData, apellido: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CLU (7 dígitos) <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={formData.clu || ''}
            onChange={(e) => {
              // Solo permitir números y limitar a 7 dígitos
              const value = e.target.value.replace(/\D/g, '').slice(0, 7);
              onChange({...formData, clu: value});
            }}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1234567"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Número de CLU de 7 dígitos</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Vencimiento <span className="text-red-600">*</span>
          </label>
          <input
            type="date"
            value={formData.fechaVencimiento}
            onChange={(e) => onChange({...formData, fechaVencimiento: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categoría Principal <span className="text-red-600">*</span></label>
          <select
            value={formData.categoria}
            onChange={(e) => onChange({...formData, categoria: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Seleccionar categoría</option>
            <option value={CATEGORIAS.SOCIO}>{CATEGORIAS.SOCIO}</option>
            <option value={CATEGORIAS.VITALICIO}>{CATEGORIAS.VITALICIO}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Instructor (opcional)</label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="tipoInstructor"
                checked={!!formData.instructor_ita}
                onChange={() => onChange({
                  ...formData, 
                  instructor_ita: formData.instructor_ita || 1, 
                  instructor_itb: null
                })}
                className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="flex-1">{CATEGORIAS.INSTRUCTOR_ITA}</span>
              {!!formData.instructor_ita && (
                <input
                  type="number"
                  min="1"
                  value={formData.instructor_ita || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : '';
                    onChange({
                      ...formData,
                      instructor_ita: value || 1,
                      instructor_itb: null
                    });
                  }}
                  className="w-20 px-2 py-1 border rounded text-sm"
                  placeholder="Número"
                />
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="tipoInstructor"
                checked={!!formData.instructor_itb}
                onChange={() => onChange({
                  ...formData, 
                  instructor_ita: null, 
                  instructor_itb: formData.instructor_itb || 1
                })}
                className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="flex-1">{CATEGORIAS.INSTRUCTOR_ITB}</span>
              {!!formData.instructor_itb && (
                <input
                  type="number"
                  min="1"
                  value={formData.instructor_itb || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : '';
                    onChange({
                      ...formData,
                      instructor_ita: null,
                      instructor_itb: value || 1
                    });
                  }}
                  className="w-20 px-2 py-1 border rounded text-sm"
                  placeholder="Número"
                />
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="tipoInstructor"
                checked={!formData.instructor_ita && !formData.instructor_itb}
                onChange={() => onChange({
                  ...formData, 
                  instructor_ita: null, 
                  instructor_itb: null
                })}
                className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Ninguno</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Selecciona el tipo de instructor e ingresa el número correspondiente</p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña {!editingUser ? <span className="text-red-600">*</span> : '(dejar vacío para no cambiar)'}
          </label>
          <input
            type="text"
            value={formData.password}
            onChange={(e) => onChange({...formData, password: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={editingUser ? "Dejar vacío para mantener la actual" : "Mínimo 4 caracteres"}
            required={!editingUser}
          />
          <p className="text-xs text-gray-500 mt-1">
            {!editingUser ? 'La contraseña es obligatoria para nuevos socios (mínimo 4 caracteres)' : 'Solo completar si deseas cambiar la contraseña'}
          </p>
        </div>

        {/* Campo de foto */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto del Socio (opcional)
          </label>
          
          <div className="flex items-start space-x-4">
            {/* Preview de la foto */}
            {(fotoPreview || (editingUser && formData.foto)) && (
              <div className="relative">
                <img 
                  src={fotoPreview || formData.foto} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                />
                {fotoPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveFoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Botón para seleccionar foto */}
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="hidden"
                id="foto-input"
              />
              <label
                htmlFor="foto-input"
                className="cursor-pointer inline-flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"
              >
                <Upload className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-sm text-gray-600">
                  {fotoPreview ? 'Cambiar foto' : 'Seleccionar foto'}
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Formatos: JPG, PNG, GIF. Tamaño máximo: 5MB
              </p>
              {editingUser && !fotoPreview && (
                <p className="text-xs text-blue-600 mt-1">
                  Se mantendrá la foto actual si no seleccionas una nueva
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 mt-6">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 flex items-center space-x-2 disabled:bg-gray-400 transition-colors"
        >
          <Save className="w-5 h-5" />
          <span>{loading ? 'Guardando...' : 'Guardar'}</span>
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default SocioForm;