# Módulo de Programación de Calefacción

Este módulo proporciona una interfaz completa para programar el encendido y apagado del sistema de calefacción, con soporte para múltiples horarios y modos de operación.

## Estructura del Módulo

```
schedule/
├── ScheduleManager.tsx     # Componente principal
├── components/            # Componentes secundarios
│   ├── ModeCard.tsx       # Tarjeta de modo de operación
│   ├── ScheduleForm.tsx   # Formulario de programación
│   └── ScheduleList.tsx   # Lista de programaciones
├── constants.ts           # Constantes compartidas
├── hooks/
│   └── useScheduleManager.ts # Lógica de negocio
└── types/
    ├── index.ts           # Exportación de tipos
    └── types.ts           # Definiciones de tipos
```

## Componente Principal: ScheduleManager

### Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `isOpen` | `boolean` | Sí | Controla la visibilidad del modal |
| `onClose` | `() => void` | Sí | Función para cerrar el modal |
| `onSave` | `(schedules: Schedule[]) => Promise<void>` | Sí | Función para guardar las programaciones |
| `schedules` | `Schedule[]` | No | Lista de programaciones existentes (opcional) |

### Estados

| Estado | Tipo | Inicial | Descripción |
|--------|------|----------|-------------|
| `localSchedules` | `Schedule[]` | `[]` | Almacena la lista de programaciones |
| `startTime` | `string` | `'08:00'` | Hora de inicio seleccionada |
| `endTime` | `string` | `'09:00'` | Hora de fin seleccionada |
| `selectedOption` | `string` | `'off'` | Modo de operación seleccionado |
| `targetTemp` | `number` | `21` | Temperatura objetivo para modo automático |
| `selectedDays` | `Record<string, boolean>` | `{}` | Días de la semana seleccionados |
| `isSubmitting` | `boolean` | `false` | Estado de envío del formulario |
| `editingId` | `number \| null` | `null` | ID de la programación en edición |

### Métodos Principales

#### `handleTimeChange(time: string, isStart: boolean = true)`
Maneja el cambio de hora en los inputs de tiempo.

**Parámetros:**
- `time`: Nueva hora en formato HH:MM
- `isStart`: Indica si es la hora de inicio (true) o fin (false)

#### `toggleDay(dayId: string)`
Alterna la selección de un día de la semana.

**Parámetros:**
- `dayId`: Identificador del día (ej: 'monday')

#### `handleAddSchedule()`
Agrega o actualiza una programación.

#### `handleRemoveSchedule(id: number)`
Elimina una programación existente.

**Parámetros:**
- `id`: ID de la programación a eliminar

#### `handleEditSchedule(schedule: Schedule)`
Prepara el formulario para editar una programación existente.

**Parámetros:**
- `schedule`: Programación a editar

#### `handleSave()`
Guarda todas las programaciones.

## Tipos de Datos

### `WeekDay`
```typescript
interface WeekDay {
  id: string;           // Identificador único (ej: 'monday')
  label: string;        // Etiqueta corta (ej: 'L')
  fullLabel: string;    // Nombre completo (ej: 'Lunes')
  fullLabelShort: string; // Nombre corto (ej: 'Lun')
}
```

### `ModeType`
```typescript
interface ModeType {
  label: string;       // Nombre del modo
  color: string;       // Color principal
  icon: React.ReactNode; // Ícono del modo
  // ... otros estilos
}
```

### `Schedule`
```typescript
interface Schedule {
  id: number;                  // Identificador único
  startTime: string;           // Hora de inicio (HH:MM)
  endTime: string;             // Hora de fin (HH:MM)
  mode: string;                // Modo de operación
  targetTemp?: number;         // Temperatura objetivo (opcional)
  days: Record<string, boolean>; // Días activos
}
```

## Uso Básico

```tsx
import { ScheduleManager } from './components/schedule';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const handleSave = async (newSchedules: Schedule[]) => {
    try {
      await api.saveSchedules(newSchedules);
      setSchedules(newSchedules);
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Gestionar Programación</button>
      <ScheduleManager
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
        schedules={schedules}
      />
    </div>
  );
}
```

## Personalización

### Temas
El componente utiliza los colores de Chakra UI y puede ser personalizado mediante el tema de la aplicación.

### Estilos
Los estilos están definidos usando las utilidades de Chakra UI y pueden ser sobrescritos usando las props de estilo.

## Consideraciones

- El componente está diseñado para ser controlado externamente a través de las props `isOpen` y `onClose`
- La función `onSave` debe manejar la persistencia de los datos
- Se recomienda validar los datos antes de guardarlos en el servidor
