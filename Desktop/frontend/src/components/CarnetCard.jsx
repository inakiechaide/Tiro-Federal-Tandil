import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import QRCodeGenerator from '../components/QRCodeGenerator';

/**
 * Componente para mostrar el carnet del socio
 */
const CarnetCard = ({ socio }) => {
  const [showQR, setShowQR] = useState(false);

  if (!socio) return null;

  // Determinar si es instructor y qué tipo
  const esInstructor = (socio.instructor_ita || socio.instructor_itb) ? true : 
                     socio.categoria?.toUpperCase().includes('INSTRUCTOR');
  
  let tipoInstructor = '';
  let numeroInstructor = null;
  
  if (socio.instructor_ita) {
    tipoInstructor = 'ITA';
    numeroInstructor = socio.instructor_ita;
  } else if (socio.instructor_itb) {
    tipoInstructor = 'ITB';
    numeroInstructor = socio.instructor_itb;
  } else if (esInstructor) {
    // Para compatibilidad con el formato anterior
    tipoInstructor = socio.categoria?.toUpperCase().includes('ITA') ? 'ITA' : 
                   socio.categoria?.toUpperCase().includes('ITB') ? 'ITB' : '';
  }
  
  // Categoría base (Vitalicio o Socio)
  const categoriaBase = socio.categoria?.toUpperCase().includes('VITALICIO') 
    ? 'VITALICIO' 
    : 'SOCIO';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-0">
      {/* VERSION ÚNICA - Tarjeta horizontal para todos los tamaños */}
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-gray-200">
        {/* Header con franja diagonal */}
        <div className="relative bg-gradient-to-r from-sky-200 via-sky-100 to-white h-16 md:h-24">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-br from-yellow-300 to-yellow-400 transform skew-x-12 origin-top-right"></div>
          
          <div className="relative z-10 h-full flex items-center px-3 md:px-6">
            {/* Espacio vacío izquierdo para balancear */}
            <div className="flex-1"></div>
            
            {/* Logo circular centrado */}
            <div className="flex justify-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 md:border-4 border-white shadow-lg bg-white flex items-center justify-center p-0">
                <img 
                  src="/logo.png" 
                  alt="Tiro Federal Tandil"
                  className="w-full h-full object-contain"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
            
            {/* Info derecha */}
            <div className="flex-1 flex justify-end">
              <div className="text-right">
                <div className="text-sm md:text-2xl font-bold text-gray-800">
                  SOCIO N° {socio.numeroSocio}
                </div>
                <div className="text-[8px] md:text-xs font-semibold text-gray-700 uppercase mt-1">
                  CATEGORÍA: {categoriaBase}
                </div>
                {esInstructor && tipoInstructor && (
                  <div className="text-[8px] md:text-xs font-semibold text-blue-700 uppercase">
                    INSTRUCTOR {tipoInstructor}{numeroInstructor ? ` Nº${numeroInstructor}` : ''}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cuerpo principal */}
        <div className="grid grid-cols-12 gap-2 md:gap-4 p-3 md:p-6">
          {/* Foto */}
          <div className="col-span-3 flex justify-start">
            <div className="w-16 h-16 md:w-32 md:h-32 rounded-full overflow-hidden border-2 md:border-4 border-black shadow-lg">
              <img
                src={socio.foto}
                alt="Foto socio"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Contenido central y derecho */}
          <div className="col-span-9 flex flex-col justify-between">
            {/* Nombre del socio */}
            <div className="text-left mb-2 md:mb-4">
              <h3 className="text-sm md:text-3xl font-bold text-gray-900 uppercase tracking-wide leading-tight">
                {socio.getNombreCompleto()}
              </h3>
            </div>

            {/* Footer con DNI y CLU */}
            <div className="bg-gradient-to-r from-sky-300 via-sky-200 to-gray-200 rounded-lg p-2 md:p-4 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-1/4 h-full bg-gradient-to-tl from-yellow-300 to-yellow-200 transform skew-x-12"></div>
              
              <div className="relative z-10 grid grid-cols-2 gap-2 md:gap-3">
                <div>
                  <div className="text-[10px] md:text-sm font-bold text-gray-800 leading-tight">
                    {socio.getNombreCompleto().toUpperCase()}
                  </div>
                  <div className="text-[8px] md:text-xs font-semibold text-gray-700 mt-1">
                    D.N.I. {socio.dni}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] md:text-sm font-bold text-gray-800">
                    CLU: {socio.clu}
                  </div>
                  <div className="text-[8px] md:text-xs text-gray-600 mt-1">
                    Vto. {socio.getFechaFormateada()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Título del club */}
        <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 py-2 md:py-3 text-center px-2">
          <h2 className="text-white font-bold text-[10px] md:text-xl uppercase tracking-wider leading-tight">
            Tiro Federal "Brig. Gral Martín Rodríguez" de Tandil
          </h2>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 py-1 md:py-2 text-center">
          <p className="text-white text-[8px] md:text-xs font-medium italic">
            Válido sólo con la cuota al día
          </p>
        </div>

        {/* Botón QR */}
        <div className="p-2 md:p-4 bg-gray-50">
          <button
            onClick={() => setShowQR(!showQR)}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 md:py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 shadow-md"
          >
            <QrCode className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-base">{showQR ? 'Ocultar' : 'Mostrar'} Código QR</span>
          </button>

          {showQR && (
            <div className="mt-3 md:mt-4 bg-white rounded-lg p-4 md:p-6 border-2 border-gray-200">
              <div className="text-center">
                <div className="w-32 h-32 md:w-48 md:h-48 mx-auto bg-white rounded-lg flex items-center justify-center mb-3">
                  <QRCodeGenerator value={`socio:${socio.numeroSocio}`} size={180} />
                </div>
                <p className="text-gray-700 text-xs md:text-sm font-semibold">
                  Código: {socio.numeroSocio}
                </p>
                <p className="text-gray-500 text-[10px] md:text-xs mt-2">
                  Presentá este código en la entrada
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarnetCard;