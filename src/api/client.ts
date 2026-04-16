const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = 'ApiError'
  }
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | null | undefined>,
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }

  const res = await fetch(url.toString())

  if (!res.ok) {
    throw new ApiError(res.status, `API error ${res.status}: ${path}`)
  }

  return res.json() as Promise<T>
}
