// src/views/ScannerView.jsx
import React, { useState } from 'react';
import { Camera, X, Keyboard, QrCode } from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import ScanResult from '../components/ScanResult';
import SocioController from '../controllers/SocioController';
import { VIEWS } from '../utils/constants';

/**
 * Vista del escáner de carnets
 */
const ScannerView = ({ onNavigate }) => {
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanMode, setScanMode] = useState('manual'); // 'manual' o 'camera'

  const verificarSocio = async (numeroSocio) => {
    setLoading(true);
    try {
      const result = await SocioController.verificarCarnet(numeroSocio);
      if (result.success) {
        setScanResult({
          valid: result.valid,
          data: result.socio 
            ? `${result.socio.getNombreCompleto()} - Socio N° ${result.socio.numeroSocio}` 
            : result.mensaje,
          vencimiento: result.socio?.fechaVencimiento,
          timestamp: new Date().toLocaleString('es-AR')
        });
      } else {
        setScanResult({
          valid: false,
          data: 'Error al verificar',
          timestamp: new Date().toLocaleString('es-AR')
        });
      }
    } catch (error) {
      console.error('Error en verificación:', error);
      setScanResult({
        valid: false,
        data: 'Error de conexión',
        timestamp: new Date().toLocaleString('es-AR')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async () => {
    if (!scanInput.trim()) return;
    await verificarSocio(scanInput.trim());
  };

  const handleQRScan = (result) => {
  if (result && result.length > 0) {
    const qrValue = result[0].rawValue;
    console.log('QR escaneado:', qrValue);
    
    let numeroSocio = qrValue.trim();
    
    // Si tiene formato "socio:001234"
    if (qrValue.includes(':')) {
      numeroSocio = qrValue.split(':').pop().trim();
    }
    // Si tiene formato "SOCIO-001234"
    else if (qrValue.includes('-')) {
      numeroSocio = qrValue.split('-').pop().trim();
    }
    
    console.log('Número extraído:', numeroSocio);
    
    verificarSocio(numeroSocio);
    setScanMode('manual');
  }
};

  const handleReset = () => {
    setScanResult(null);
    setScanInput('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button 
            onClick={() => onNavigate(VIEWS.ADMIN)} 
            className="flex items-center space-x-2"
          >
            <X className="w-6 h-6" />
            <span>Volver al Panel</span>
          </button>
          <h1 className="font-bold">Verificar Carnet</h1>
          <div className="w-6"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <div className="text-center mb-6">
            <Camera className="w-16 h-16 mx-auto text-blue-900 mb-3" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Verificación de Carnet
            </h2>
            <p className="text-gray-600">
              {scanMode === 'manual' 
                ? 'Ingresá el número de socio o escaneá el QR'
                : 'Escaneá el código QR del carnet'
              }
            </p>
          </div>

          {/* Botón toggle */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setScanMode(scanMode === 'manual' ? 'camera' : 'manual')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-900 rounded-lg hover:bg-blue-200 transition-colors"
            >
              {scanMode === 'manual' ? (
                <>
                  <QrCode className="w-5 h-5" />
                  <span>Escanear QR</span>
                </>
              ) : (
                <>
                  <Keyboard className="w-5 h-5" />
                  <span>Ingresar Manual</span>
                </>
              )}
            </button>
          </div>

          {/* Modo Manual */}
          {scanMode === 'manual' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Socio
                </label>
                <input
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                  placeholder="001234"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleScan}
                disabled={loading}
                className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Verificando...' : 'Verificar'}
              </button>
            </div>
          )}

          {/* Modo Cámara */}
          {scanMode === 'camera' && (
            <div className="space-y-4">
              <div className="w-full aspect-square max-w-md mx-auto bg-black rounded-lg overflow-hidden">
                <Scanner
                  onScan={handleQRScan}
                  constraints={{
                    facingMode: 'environment'
                  }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Posicioná el QR del carnet frente a la cámara
              </p>
            </div>
          )}
        </div>

        <ScanResult result={scanResult} onReset={handleReset} />
      </div>
    </div>
  );
};

export default ScannerView;