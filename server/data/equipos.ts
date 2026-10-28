import type { Equipo } from '../types/equipo'

// Datos de ejemplo en memoria: se reinician cada vez que se apaga el servidor.
export const equipos: Equipo[] = [
  {
    id: 'eq-001',
    nombre: 'Caminadora profesional',
    categoria: 'Cardio',
    cantidad: 6,
    estado: 'Disponible',
    fechaAdquisicion: '2025-03-12',
  },
  {
    id: 'eq-002',
    nombre: 'Juego de mancuernas 5-50 kg',
    categoria: 'Peso libre',
    cantidad: 10,
    estado: 'Disponible',
    fechaAdquisicion: '2025-05-20',
  },
  {
    id: 'eq-003',
    nombre: 'Banca de press inclinada',
    categoria: 'Fuerza',
    cantidad: 3,
    estado: 'En mantenimiento',
    fechaAdquisicion: '2024-11-08',
  },
  {
    id: 'eq-004',
    nombre: 'Elíptica',
    categoria: 'Cardio',
    cantidad: 2,
    estado: 'Fuera de servicio',
    fechaAdquisicion: '2024-02-16',
  },
  {
    id: 'eq-005',
    nombre: 'Rack de sentadillas',
    categoria: 'Fuerza',
    cantidad: 4,
    estado: 'Disponible',
    fechaAdquisicion: '2025-08-30',
  },
]
