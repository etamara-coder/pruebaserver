interface ErrorConDatos {
  data?: {
    statusMessage?: string
    message?: string
  }
}

export function mensajeErrorApi(error: unknown, mensajePorDefecto: string): string {
  if (error && typeof error === 'object') {
    const data = (error as ErrorConDatos).data
    return data?.statusMessage ?? data?.message ?? mensajePorDefecto
  }

  return mensajePorDefecto
}
