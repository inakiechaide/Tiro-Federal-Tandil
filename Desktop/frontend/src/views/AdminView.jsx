// src/views/AdminView.jsx
import React from 'react';
import { Plus, Trash2, Users, QrCode, Pencil } from 'lucide-react';
import Header from '../components/Header';
import SocioForm from '../components/SocioForm';
import { useSocios } from '../hooks/useSocios';

const AdminView = ({ onLogout, onNavigate }) => {
  const {
    socios,
    loading,
    editingUser,
    showForm,
    formData,
    setFormData,
    setShowForm,
    saveSocio,
    deleteSocio,
    editSocio,
    resetForm,

    // 🔍 agregados
    search,
    setSearch
  } = useSocios();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        title="Panel de Administración"
        subtitle="Gestión de Socios"
        icon={Users}
        showLogout={true}
        onLogout={onLogout}
      />

      <div className="max-w-6xl mx-auto p-2 sm:p-4">
        {/* Botones de acción */}
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Nuevo Socio</span>
            </button>
            
            <button
              onClick={() => onNavigate('scanner')}
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Verificar Carnet</span>
            </button>
          </div>

          {/* 🔍 Campo de búsqueda */}
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar por DNI, nombre, apellido, número..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-lg shadow-sm w-full sm:w-64 md:w-72 focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Formulario */}
        {showForm && (
          <SocioForm
            formData={formData}
            editingUser={editingUser}
            loading={loading}
            onSave={saveSocio}
            onCancel={resetForm}
            onChange={setFormData}
          />
        )}

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-3 sm:p-4 bg-blue-900 text-white font-bold text-sm sm:text-base">
            Lista de Socios ({socios.length})
          </div>
          
          {loading ? (
            <div className="p-6 sm:p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-900 mx-auto mb-3 sm:mb-4"></div>
              <span className="text-sm sm:text-base">Cargando...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[600px] sm:min-w-0">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Foto</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">DNI</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Nombre</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">N° Socio</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">CLU</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Vencimiento</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Instructor</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Estado</th>
                      <th className="px-2 sm:px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                      <span className="hidden sm:inline">Acciones</span>
                      <span className="sm:hidden">Acc.</span>
                    </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {socios.map((socio) => (
                      <tr key={socio.id} className="hover:bg-gray-50 group">
                        <td className="px-2 sm:px-3 py-2">
                          <img 
                            src={socio.foto} 
                            alt={`${socio.nombre} ${socio.apellido}`}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(socio.nombre)}+${encodeURIComponent(socio.apellido)}&size=200&background=2c5282&color=fff`;
                            }}
                          />
                        </td>
                        <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{socio.dni}</td>
                        <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900">{socio.getNombreCompleto()}</td>
                        <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{socio.numeroSocio}</td>
                        <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900 font-mono whitespace-nowrap">{socio.clu}</td>
                        <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900 whitespace-nowrap">{socio.getFechaFormateada()}</td>
                        <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-900">
                          <div className="flex flex-col sm:flex-row gap-1">
                            {socio.instructor_ita && <span className="bg-blue-100 text-blue-800 text-2xs sm:text-xs px-1.5 sm:px-2 py-0.5 rounded">ITA: {socio.instructor_ita}</span>}
                            {socio.instructor_itb && <span className="bg-purple-100 text-purple-800 text-2xs sm:text-xs px-1.5 sm:px-2 py-0.5 rounded">ITB: {socio.instructor_itb}</span>}
                            {!socio.instructor_ita && !socio.instructor_itb && <span className="text-gray-400 text-xs">-</span>}
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 py-2">
                          <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-2xs sm:text-xs font-semibold whitespace-nowrap ${
                            socio.isVigente ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {socio.getEstado()}
                          </span>
                        </td>
                        <td className="px-2 sm:px-3 py-2">
                          <div className="flex items-center justify-start space-x-1 sm:space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                editSocio(socio);
                              }}
                              className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                              title="Editar"
                              aria-label="Editar socio"
                            >
                              <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span className="sr-only sm:not-sr-only sm:ml-1 sm:text-sm">Editar</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`¿Estás seguro de eliminar a ${socio.getNombreCompleto()}?`)) {
                                  deleteSocio(socio.id);
                                }
                              }}
                              className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              title="Eliminar"
                              aria-label="Eliminar socio"
                            >
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              <span className="sr-only sm:not-sr-only sm:ml-1 sm:text-sm">Eliminar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminView;
