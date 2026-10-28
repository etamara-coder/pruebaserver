import type { Socio } from '../types/socio'

// Datos de ejemplo en memoria: se reinician cada vez que se apaga el servidor.
export const socios: Socio[] = [
  {
    id: 'soc-001',
    nombre: 'Ana Torres',
    email: 'ana.torres@fitzone.com',
    telefono: '300 123 4567',
    membresia: 'Anual',
    fechaInicio: '2026-01-15',
    activo: true,
  },
  {
    id: 'soc-002',
    nombre: 'Carlos Ramírez',
    email: 'carlos.ramirez@fitzone.com',
    telefono: '310 555 7890',
    membresia: 'Mensual',
    fechaInicio: '2026-09-01',
    activo: true,
  },
  {
    id: 'soc-003',
    nombre: 'Luisa Fernández',
    email: 'luisa.fernandez@fitzone.com',
    telefono: '320 444 1122',
    membresia: 'Trimestral',
    fechaInicio: '2026-06-10',
    activo: false,
  },
]
