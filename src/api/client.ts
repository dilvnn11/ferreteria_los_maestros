const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:9091";

export type ApiError = {
  error?: string;
  mensaje?: string;
  campos?: Record<string, string> | null;
};

export class ApiException extends Error {
  status: number;
  campos?: Record<string, string> | null;

  constructor(status: number, mensaje: string, campos?: Record<string, string> | null) {
    super(mensaje);
    this.status = status;
    this.campos = campos;
  }
}

function getToken(): string | null {
  return localStorage.getItem("ferreteria:token");
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem("ferreteria:token", token);
  } else {
    localStorage.removeItem("ferreteria:token");
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { mensaje: text };
    }
  }

  if (!res.ok) {
    const err = data as ApiError | null;
    throw new ApiException(
      res.status,
      err?.error ?? err?.mensaje ?? `Error ${res.status}`,
      err?.campos ?? null,
    );
  }

  return data as T;
}
