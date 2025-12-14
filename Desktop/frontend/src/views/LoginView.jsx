import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Vista de Login
 */
const LoginView = ({ onLoginSocio, onLoginAdmin, loading }) => {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = isAdminMode
      ? await onLoginAdmin(username, password)
      : await onLoginSocio(dni, password);

    if (!result.success) {
      setError(result.error);
    }
  };

  const toggleMode = () => {
    setIsAdminMode(!isAdminMode);
    setError('');
    setDni('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card principal */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-gray-200">
          
          {/* Header con logo y título */}
          <div className="relative bg-gradient-to-r from-sky-200 via-sky-100 to-white py-8 px-6">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-br from-yellow-300 to-yellow-400 transform skew-x-12 origin-top-right"></div>
            
            {/* Logo circular */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white flex items-center justify-center p-0 mb-4">
                <img 
                  src="/logo.png" 
                  alt="Tiro Federal Tandil"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 text-center">
                Tiro Federal Tandil
              </h1>
              <p className="text-sm text-gray-600 mt-1">Carnet Virtual de Socio</p>
            </div>
          </div>

          {/* Formulario */}
          <div className="p-8">
            <div className="space-y-5">
              {isAdminMode ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Usuario Admin
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                    placeholder="admin"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all"
                    autoComplete="username"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    DNI (sin puntos)
                  </label>
                  <input
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                    placeholder="12345678"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all"
                    maxLength={8}
                    autoComplete="off"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                    placeholder="Tu contraseña"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-all pr-12"
                    autoComplete={isAdminMode ? "current-password" : "off"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 text-red-800 text-sm font-medium">
                  {error}
                </div>
              )}
              
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-3 rounded-lg font-semibold hover:from-gray-800 hover:to-gray-900 transition-all disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? 'Ingresando...' : (isAdminMode ? 'Acceso Admin' : 'Ingresar')}
              </button>

              <button
                type="button"
                onClick={toggleMode}
                className="w-full text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors py-2"
              >
                {isAdminMode ? '← Volver a login de socios' : 'Acceso administrador →'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 py-3 text-center">
            <p className="text-white text-xs font-medium">
              Sistema de gestión de socios
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;