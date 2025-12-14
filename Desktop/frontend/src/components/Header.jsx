import React from 'react';
import { Shield, Menu, X, LogOut } from 'lucide-react';

/**
 * Componente Header reutilizable
 */
const Header = ({ 
  title, 
  subtitle, 
  icon: Icon = Shield, 
  menuOpen, 
  onMenuToggle, 
  onLogout, 
  showLogout = false 
}) => {
  return (
    <header className="bg-white shadow-lg border-b-2 border-gray-200">
      <div className="relative bg-gradient-to-r from-sky-200 via-sky-100 to-white">
        {/* Franja diagonal decorativa */}
        <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-br from-yellow-300 to-yellow-400 transform skew-x-12 origin-top-right"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo y texto */}
            <div className="flex items-center space-x-3">
              {/* Logo circular */}
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-white flex items-center justify-center p-0">
                <img 
                  src="/logo.png" 
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Título y subtítulo */}
              <div>
                <h1 className="font-bold text-lg text-gray-800">{title}</h1>
                {subtitle && <p className="text-xs text-gray-600">{subtitle}</p>}
              </div>
            </div>

            {/* Botones de acción */}
            {showLogout ? (
              <button 
                onClick={onLogout} 
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Salir</span>
              </button>
            ) : (
              <button 
                onClick={onMenuToggle} 
                className="p-2 hover:bg-sky-200 rounded-lg transition-colors"
              >
                {menuOpen ? <X className="w-6 h-6 text-gray-800" /> : <Menu className="w-6 h-6 text-gray-800" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;