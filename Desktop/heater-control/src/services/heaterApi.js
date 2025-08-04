// Modo de simulación (cambiar a false cuando tengas la ESP32)
export let SIMULATION_MODE = true;

// URL base de la API - Configura esta dirección con la IP de tu ESP32
const API_BASE_URL = SIMULATION_MODE ? 'http://localhost:3000' : 'http://192.168.1.100';

// Datos simulados para el modo de prueba
let simulatedState = {
  mode: 'off',
  temperature: 18,
  battery: 85,
  wifiStrength: 4
};

// Hacer que el estado simulado esté disponible globalmente para depuración
if (typeof window !== 'undefined') {
  window.simulatedState = simulatedState;
  console.log('[ESP32 SIMULATION] Estado inicial simulado:', window.simulatedState);
} else {
  console.log('[ESP32 SIMULATION] No se puede asignar estado simulado (entorno no es navegador)');
}

// Función para simular cambios en la temperatura basados en el modo
const updateSimulatedTemperature = () => {
  // Tasas de cambio más pronunciadas para mejor visualización
  const tempChangeRates = {
    'off': -0.15,    // Enfría más rápido cuando está apagado
    'pilot': 0.02,   // Mantiene casi estable con piloto
    'min': 0.2,      // Calienta en mínimo
    'max': 0.5       // Calienta más rápido en máximo
  };
  
  // Obtener la tasa de cambio basada en el modo actual
  const baseChange = tempChangeRates[simulatedState.mode] || 0;
  
  // Añadir pequeña variación aleatoria para hacerlo más realista
  const randomVariation = (Math.random() * 0.1) - 0.05;
  const tempChange = baseChange + randomVariation;
  
  // Aplicar cambio de temperatura con límites
  simulatedState.temperature = Math.max(10, Math.min(40, simulatedState.temperature + tempChange));
  
  // Simular consumo de batería basado en el modo
  const batteryDrainRates = {
    'off': 0.01,
    'pilot': 0.03,
    'min': 0.1,
    'max': 0.2
  };
  
  const batteryChange = -batteryDrainRates[simulatedState.mode] || 0;
  simulatedState.battery = Math.max(0, Math.min(100, simulatedState.battery + batteryChange));
  
  // Actualizar la señal WiFi aleatoriamente
  simulatedState.wifiStrength = Math.max(1, Math.min(4, Math.round(3 + Math.random())));
  
  return simulatedState;
};

// Actualizar estado simulado cada segundo
if (SIMULATION_MODE) {
  setInterval(updateSimulatedTemperature, 1000);
}

/**
 * Envía una solicitud al servidor ESP32
 * @param {string} endpoint - El endpoint de la API
 * @param {string} method - Método HTTP (GET, POST, etc.)
 * @param {Object} [data] - Datos a enviar en el cuerpo de la solicitud
 * @returns {Promise<Object>} - Respuesta del servidor
 */
// Función para verificar si el servidor está disponible
const checkServerStatus = async () => {
  if (SIMULATION_MODE) {
    return true; // En modo simulación, siempre está disponible
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${API_BASE_URL}/status`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('El servidor no está disponible:', error);
    return false;
  }
};

const apiRequest = async (endpoint, method = 'GET', data = null) => {
  const isServerAvailable = await checkServerStatus();
  
  if (!isServerAvailable) {
    throw new Error('El servidor del calefactor no está disponible');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
  };

  // Log de la petición
  console.log('[ESP32 API] Realizando petición:', {
    method,
    url,
    data: data ? JSON.stringify(data) : 'No data'
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const config = {
      method,
      headers,
      signal: controller.signal
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    // Algunos endpoints pueden no devolver contenido
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const responseData = await response.json();
      console.log('[ESP32 API] Respuesta recibida:', {
        status: response.status,
        data: responseData
      });
      return responseData;
    }
    
    const responseData = await response.text();
    console.log('[ESP32 API] Respuesta recibida:', {
      status: response.status,
      data: responseData
    });
    return responseData;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('[ESP32 API] Error en la petición:', {
      error: error.message,
      type: error.name === 'AbortError' ? 'Timeout' : 'Error de conexión'
    });
    
    if (error.name === 'AbortError') {
      throw new Error('Tiempo de espera agotado. Verifica la conexión con el calefactor.');
    }
    
    throw new Error(`Error de conexión: ${error.message}`);
  }
};

// Endpoints de la API
export const heaterApi = {
  /**
   * Obtiene el estado actual del calefactor
   * @returns {Promise<Object>} Estado del calefactor
   */
  getStatus: async () => {
    if (SIMULATION_MODE) {
      // Log de la petición simulada
      console.log('[ESP32 SIMULATION] Petición simulada:', {
        endpoint: '/status',
        method: 'GET'
      });
      
      // Log del estado simulado actual
      console.log('[ESP32 SIMULATION] Estado simulado actual:', {
        mode: simulatedState.mode,
        temperature: simulatedState.temperature,
        battery: simulatedState.battery,
        wifiStrength: simulatedState.wifiStrength
      });
      
      return new Promise(resolve => {
        setTimeout(() => {
          const response = {
            ...simulatedState,
            timestamp: new Date().toISOString()
          };
          console.log('[ESP32 SIMULATION] Respuesta simulada:', response);
          resolve(response);
        }, 300); // Pequeño retraso para simular latencia de red
      });
    } else {
      return apiRequest('/status');
    }
  },

  /**
   * Cambia el modo de operación del calefactor
   * @param {string} mode - Modo a establecer (off, pilot, min, max)
   * @returns {Promise<Object>} Respuesta del servidor
   */
  setMode: async (mode) => {
    if (SIMULATION_MODE) {
      try {
        // Log de la petición simulada
        console.log('[ESP32 SIMULATION] Petición simulada:', {
          endpoint: '/set-mode',
          method: 'POST',
          data: mode
        });

        // Actualizar modo en la simulación
        simulatedState.mode = mode;

        // Log del estado simulado
        console.log('[ESP32 SIMULATION] Estado simulado actualizado:', {
          mode: simulatedState.mode,
          temperature: simulatedState.temperature,
          battery: simulatedState.battery,
          wifiStrength: simulatedState.wifiStrength
        });

        // Simular respuesta del servidor
        const response = {
          success: true,
          message: `Modo cambiado a ${mode}`,
          mode,
          temperature: simulatedState.temperature,
          battery: simulatedState.battery,
          wifiStrength: simulatedState.wifiStrength
        };

        // Retraso para simular latencia de red
        await new Promise(resolve => setTimeout(resolve, 300));

        console.log('[ESP32 SIMULATION] Respuesta simulada:', response);
        return response;
      } catch (error) {
        console.error('[ESP32 SIMULATION] Error en la petición:', error);
        throw error;
      }
    }

    return apiRequest('/mode', 'POST', { mode });
  },

  /**
   * Obtiene la temperatura actual
   * @returns {Promise<Object>} Datos de temperatura
   */
  getTemperature: async () => {
    if (SIMULATION_MODE) {
      return { temperature: simulatedState.temperature };
    }
    return apiRequest('/temperature');
  },

  /**
   * Obtiene el consumo de gas actual
   * @returns {Promise<Object>} Datos de consumo
   */
  getGasConsumption: async () => {
    if (SIMULATION_MODE) {
      // Simular consumo de gas basado en el modo
      const consumption = {
        'off': 0,
        'pilot': 0.05,
        'min': 0.5,
        'max': 1.2
      }[simulatedState.mode] || 0;
      
      return { consumption: consumption.toFixed(2) };
    }
    return apiRequest('/gas-consumption');
  },

  /**
   * Obtiene información del sistema
   * @returns {Promise<Object>} Información del sistema
   */
  getSystemInfo: async () => {
    if (SIMULATION_MODE) {
      return {
        version: '1.0.0',
        uptime: Math.floor(process.uptime()),
        freeMemory: Math.floor(Math.random() * 100000) + 50000,
        simulation: true
      };
    }
    return apiRequest('/system-info');
  },

  /**
   * Activa/desactiva el modo de simulación
   * @param {boolean} active - true para activar, false para desactivar
   */
  setSimulationMode: (active) => {
    SIMULATION_MODE = active;
  }
};
