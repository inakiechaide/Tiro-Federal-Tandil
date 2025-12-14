// src/views/CarnetView.jsx
import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import Header from '../components/Header';
import Menu from '../components/Menu';
import CarnetCard from '../components/CarnetCard';
import { VIEWS } from '../utils/constants';

/**
 * Vista del Carnet del Socio
 */
const CarnetView = ({ socio, onLogout, onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!socio) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando carnet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        title="Tiro Federal Tandil"
        subtitle="Carnet de Socio"
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen(!menuOpen)}
      />

      {menuOpen && (
        <Menu 
          onScannerClick={() => {
            onNavigate(VIEWS.SCANNER);
            setMenuOpen(false);
          }}
          onLogout={onLogout}
        />
      )}

      <div className="max-w-4xl mx-auto p-4 pb-20">
        <div className={`${socio.isVigente ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border-2 rounded-lg p-4 mb-4 flex items-center space-x-3`}>
          {socio.isVigente ? (
            <>
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Carnet Vigente</p>
                <p className="text-sm text-green-700">Válido hasta {socio.getFechaFormateada()}</p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Carnet Vencido</p>
                <p className="text-sm text-red-700">Vencido el {socio.getFechaFormateada()}</p>
              </div>
            </>
          )}
        </div>

        <CarnetCard socio={socio} />
      </div>
    </div>
  );
};

export default CarnetView;