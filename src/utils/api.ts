
// Único lugar del frontend que sabe hablar con la API: arma la URL, envía JSON,
// agrega el token cuando hace falta y traduce los errores del backend a mensajes.

const API_URL = import.meta.env.VITE_API_URL ?? "";

type ApiConfig = {
  getToken: () => string | null;
  onUnauthorized: () => void;
};

// Se configura una sola vez al arrancar la app (ver main.tsx).
// no necesita importar authStore, y evitamos una dependencia circular.
let config: ApiConfig = {
  getToken: () => null,
  onUnauthorized: () => {},
};

export const configureApi = (newConfig: ApiConfig) => {
  config = newConfig;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const errorMessage = (error: unknown): string =>
  error instanceof ApiError ? error.message : "Ocurrió un error inesperado";

// Forma de los errores que devuelve Spring (ProblemDetail + nuestro mapa "errors")
type ProblemBody = {
  detail?: string;
  errors?: Record<string, string>;
};

// Spring Security responde 401 y 403 SIN cuerpo, así que necesitamos mensajes propios
const defaultMessage = (status: number): string => {
  if (status === 401) return "Tu sesión expiró. Inicia sesión nuevamente";
  if (status === 403) return "No tienes permisos para realizar esta acción";
  if (status === 404) return "No se encontró el recurso solicitado";
  return "Ocurrió un error inesperado";
};

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  // Solo las rutas protegidas piden token. Las públicas NO lo envían:
  // si el token estuviera vencido, Spring rechazaría incluso una ruta pública.
  auth?: boolean;
};

export async function apiFetch<T = void>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = false } = options;
  const token = auth ? config.getToken() : null;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch solo lanza excepción cuando no hay conexión con el servidor
    throw new ApiError("Error de conexión con el servidor", 0);
  }

  // 204 No Content (los DELETE): no hay cuerpo que leer
  if (res.status === 204) return undefined as T;

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    // Sesión vencida o token inválido: cerramos la sesión local
    if (res.status === 401 && token) config.onUnauthorized();

    const problem = (data ?? {}) as ProblemBody;
    const validation = problem.errors
      ? Object.values(problem.errors).join(". ")
      : undefined;

    throw new ApiError(
      validation ?? problem.detail ?? defaultMessage(res.status),
      res.status,
    );
  }

  return data as T;
}