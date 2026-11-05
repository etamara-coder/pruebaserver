import fs from 'node:fs'
import path from 'node:path'

export type EstadoEquipo = 'Disponible' | 'En mantenimiento' | 'Fuera de servicio'

export interface Equipo {
  id: string
  nombre: string
  categoria: string
  cantidad: number
  estado: EstadoEquipo
  fechaAdquisicion: string
}

const equiposIniciales: Equipo[] = [
  {
    id: '1',
    nombre: 'Caminadora Pro X1',
    categoria: 'Cardio',
    cantidad: 6,
    estado: 'Disponible',
    fechaAdquisicion: '2026-03-10'
  },
  {
    id: '2',
    nombre: 'Prensa de Piernas 45°',
    categoria: 'Musculación',
    cantidad: 2,
    estado: 'Disponible',
    fechaAdquisicion: '2026-02-20'
  },
  {
    id: '3',
    nombre: 'Bicicleta de Spinning #4',
    categoria: 'Salón Grupal',
    cantidad: 10,
    estado: 'En mantenimiento',
    fechaAdquisicion: '2026-04-01'
  },
  {
    id: '4',
    nombre: 'Polea Doble Crossover',
    categoria: 'Peso Integrado',
    cantidad: 1,
    estado: 'Fuera de servicio',
    fechaAdquisicion: '2026-01-05'
  },
]

const dataDir = path.resolve(process.cwd(), 'data')
const filePath = path.join(dataDir, 'equipos.json')

function cargarDesdeArchivo(): Equipo[] {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(equiposIniciales, null, 2), 'utf-8')
    return [...equiposIniciales]
  }

  const contenido = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(contenido) as Equipo[]
}

export const equiposDB: Equipo[] = cargarDesdeArchivo()

// 👇 ESTA FUNCIÓN DEBE TENER "export"
export function guardarEquiposDB() {
  fs.writeFileSync(filePath, JSON.stringify(equiposDB, null, 2), 'utf-8')
}