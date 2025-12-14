// src/components/ScanResult.jsx
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

/**
 * Componente para mostrar resultado de escaneo
 */
const ScanResult = ({ result, onReset }) => {
  if (!result) return null;

  return (
    <div className={`${result.valid ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'} border-2 rounded-lg p-6 shadow-lg`}>
      <div className="flex items-start space-x-4">
        {result.valid ? (
          <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
        ) : (
          <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
        )}
        <div className="flex-1">
          <h3 className={`font-bold text-lg mb-1 ${result.valid ? 'text-green-900' : 'text-red-900'}`}>
            {result.valid ? 'Carnet Válido ✓' : 'Carnet Inválido ✗'}
          </h3>
          <p className={`mb-2 ${result.valid ? 'text-green-800' : 'text-red-800'}`}>
            {result.data}
          </p>
          {result.vencimiento && (
            <p className="text-sm text-gray-600">
              Vencimiento: {new Date(result.vencimiento).toLocaleDateString('es-AR')}
            </p>
          )}
          <p className="text-sm text-gray-600 mt-1">
            Verificado: {result.timestamp}
          </p>
        </div>
      </div>
      <button
        onClick={onReset}
        className="mt-4 w-full bg-white border-2 border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
      >
        Verificar Otro
      </button>
    </div>
  );
};

export default ScanResult;