// src/App.jsx
import React from 'react';
import { useAuth } from './hooks/useAuth';
import LoginView from './views/LoginView';
import CarnetView from './views/CarnetView';
import ScannerView from './views/ScannerView';
import AdminView from './views/AdminView';
import { VIEWS } from './utils/constants';

/**
 * Componente principal de la aplicación
 * Principio: Single Responsibility - Solo maneja el enrutamiento de vistas
 */
const App = () => {
  const {
    view,
    setView,
    isAdmin,
    userData,
    loading,
    initialized,
    handleLoginSocio,
    handleLoginAdmin,
    handleLogout
  } = useAuth();

  // Pantalla de carga inicial
  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Iniciando aplicación...</p>
        </div>
      </div>
    );
  }

  // Renderizado según la vista actual
  return (
    <div>
      {view === VIEWS.LOGIN && (
        <LoginView 
          onLoginSocio={handleLoginSocio}
          onLoginAdmin={handleLoginAdmin}
          loading={loading}
        />
      )}
      
      {view === VIEWS.CARNET && (
        <CarnetView 
          socio={userData}
          onLogout={handleLogout}
          onNavigate={setView}
        />
      )}
      
      {view === VIEWS.SCANNER && (
        <ScannerView 
          onNavigate={setView}
        />
      )}
      
      {view === VIEWS.ADMIN && (
        <AdminView 
          onLogout={handleLogout}
          onNavigate={setView}
        />
      )}
    </div>
  );
};

export default App;