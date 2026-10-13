import { useEffect, useState } from "react";

/**
 * Igual que useState, pero el valor se lee y se guarda en LocalStorage.
 * Si la clave no existe (o el JSON es inválido) se usa `valorInicial`.
 */
export function useLocalStorage<T>(clave: string, valorInicial: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const guardado = localStorage.getItem(clave);
      return guardado !== null ? (JSON.parse(guardado) as T) : valorInicial;
    } catch {
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      // Almacenamiento lleno o no disponible: la app sigue funcionando en memoria
    }
  }, [clave, valor]);

  return [valor, setValor] as const;
}
