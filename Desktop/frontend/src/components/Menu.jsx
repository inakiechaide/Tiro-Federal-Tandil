// src/components/Menu.jsx
import React, { useState } from 'react';
import { LogOut, Lock } from 'lucide-react';
import PasswordChangeModal from './PasswordChangeModal';

/**
 * Componente Menu desplegable
 */
const Menu = ({ onLogout }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <>
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-4xl mx-auto py-2">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center space-x-3 text-gray-700"
          >
            <Lock className="w-5 h-5" />
            <span>Cambiar contraseña</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center space-x-3 text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
      
      {showPasswordModal && (
        <PasswordChangeModal 
          onClose={() => setShowPasswordModal(false)} 
        />
      )}
    </>
  );
};

export default Menu;