// src/components/CarnetCard.jsx
import React, { useState } from 'react';
import { Shield, QrCode, CreditCard, User, Calendar } from 'lucide-react';
import QRCodeGenerator from '../components/QRCodeGenerator';



/**
 * Componente para mostrar el carnet del socio
 */
const CarnetCard = ({ socio }) => {
  const [showQR, setShowQR] = useState(false);

  if (!socio) return null;

  return (
    <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-blue-950 p-4 text-center border-b-2 border-yellow-400">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <Shield className="w-8 h-8 text-yellow-400" />
          <div className="text-left">
            <h2 className="text-white font-bold text-lg">TIRO FEDERAL</h2>
            <p className="text-yellow-400 text-sm font-semibold">TANDIL</p>
          </div>
        </div>
        <p className="text-white text-xs uppercase tracking-wider">Carnet de Socio</p>
      </div>

      <div className="p-6">
        <div className="flex items-start space-x-4 mb-6">
          <img
            src={socio.foto}
            alt="Foto"
            className="w-24 h-24 rounded-lg border-4 border-white shadow-lg"
          />
          <div className="flex-1 text-white">
            <h3 className="text-2xl font-bold mb-1">
              {socio.getNombreCompleto()}
            </h3>
            <div className="space-y-1 text-sm">
              <p className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>DNI: {socio.dni}</span>
              </p>
               <p className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>CLU: {socio.clu}</span>
              </p>
              <p className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Socio N°: {socio.numeroSocio}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Vence: {socio.getFechaFormateada()}</span>
              </p>
            </div>
            <div className="mt-2">
              <span className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-xs font-bold">
                {socio.categoria}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowQR(!showQR)}
          className="w-full bg-white text-blue-900 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
        >
          <QrCode className="w-5 h-5" />
          <span>{showQR ? 'Ocultar' : 'Mostrar'} Código QR</span>
        </button>

        {showQR && (
          <div className="mt-4 bg-white rounded-lg p-4">
            <div className="text-center">
              <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-2">
                <QRCodeGenerator value={`socio:${socio.numeroSocio}`} size={160} />
              </div>
              <p className="text-gray-600 text-sm font-semibold">
                Código: {socio.numeroSocio}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Presentá este código en la entrada
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-950 p-3 text-center border-t-2 border-yellow-400">
        <p className="text-white text-xs">
          Este carnet es personal e intransferible
        </p>
      </div>
    </div>
  );
};

export default CarnetCard;