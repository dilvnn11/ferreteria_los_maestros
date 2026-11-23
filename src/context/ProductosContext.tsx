import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import * as productosApi from "../api/productos";
import { ApiException } from "../api/client";
import type { Categoria } from "../types/Categoria";
import type { Producto } from "../types/Producto";
import type { Resultado } from "../types/Resultado";
import { exitoVacio, fallo } from "../utils/resultado";
import { useAuth } from "./AuthContext";

interface ProductosContextType {
  productos: Producto[];
  categorias: Categoria[];
  cargando: boolean;
  nombreCategoria: (id: string) => string;
  refrescar: () => Promise<void>;
  agregarProducto: (producto: Producto) => Promise<Resultado>;
  actualizarProducto: (id: string, cambios: Omit<Producto, "id">) => Promise<Resultado>;
  actualizarStock: (id: string, stock: number) => Promise<Resultado>;
  eliminarProducto: (id: string) => Promise<Resultado>;
  agregarCategoria: (nombre: string) => Promise<Resultado>;
  actualizarCategoria: (id: string, nombre: string) => Promise<Resultado>;
  eliminarCategoria: (id: string) => Promise<Resultado>;
}

const ProductosContext = createContext<ProductosContextType | null>(null);

function errorAResultado(e: unknown): Resultado {
  if (e instanceof ApiException) return fallo(e.message);
  if (e instanceof Error) return fallo(e.message);
  return fallo("Error de comunicación con el servidor.");
}

export const ProductosProvider = ({ children }: { children: ReactNode }) => {
  const { permisos } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);

  const refrescar = useCallback(async () => {
    try {
      const [prods, cats] = await Promise.all([
        productosApi.listarProductos(),
        productosApi.listarCategorias(),
      ]);
      setProductos(prods);
      setCategorias(cats);
    } catch {
      // si el backend no está disponible, dejamos lo que haya
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void refrescar();
  }, [refrescar]);

  const nombreCategoria = (id: string) =>
    categorias.find((c) => c.id === id)?.nombre ?? "Sin categoría";

  const agregarProducto = async (producto: Producto) => {
    if (!permisos.crearProductos) {
      return fallo("No tienes permisos para crear productos.");
    }
    try {
      await productosApi.crearProducto(producto);
      await refrescar();
      return exitoVacio();
    } catch (e) {
      return errorAResultado(e);
    }
  };

  const actualizarProducto = async (id: string, cambios: Omit<Producto, "id">) => {
    if (!permisos.editarProductos) {
      return fallo("No tienes permisos para modificar productos.");
    }
    try {
      await productosApi.actualizarProducto(id, cambios);
      await refrescar();
      return exitoVacio();
    } catch (e) {
      return errorAResultado(e);
    }
  };

  const actualizarStock = async (id: string, stock: number) => {
    if (!permisos.modificarStock) {
      return fallo("No tienes permisos para modificar el stock.");
    }
    if (!Number.isInteger(stock) || stock < 0) {
      return fallo("El stock debe ser un número entero igual o mayor a 0.");
    }
    try {
      await productosApi.actualizarStock(id, stock);
      await refrescar();
      return exitoVacio();
    } catch (e) {
      return errorAResultado(e);
    }
  };

  const eliminarProducto = async (id: string) => {
    if (!permisos.eliminarProductos) {
      return fallo("No tienes permisos para eliminar productos.");
    }
    try {
      await productosApi.eliminarProducto(id);
      await refrescar();
      return exitoVacio();
    } catch (e) {
      return errorAResultado(e);
    }
  };

  const agregarCategoria = async (nombre: string) => {
    if (!permisos.gestionarCategorias) {
      return fallo("No tienes permisos para gestionar categorías.");
    }
    try {
      await productosApi.crearCategoria(nombre);
      await refrescar();
      return exitoVacio();
    } catch (e) {
      return errorAResultado(e);
    }
  };

  const actualizarCategoria = async (id: string, nombre: string) => {
    if (!permisos.gestionarCategorias) {
      return fallo("No tienes permisos para gestionar categorías.");
    }
    try {
      await productosApi.actualizarCategoria(id, nombre);
      await refrescar();
      return exitoVacio();
    } catch (e) {
      return errorAResultado(e);
    }
  };

  const eliminarCategoria = async (id: string) => {
    if (!permisos.gestionarCategorias) {
      return fallo("No tienes permisos para gestionar categorías.");
    }
    try {
      await productosApi.eliminarCategoria(id);
      await refrescar();
      return exitoVacio();
    } catch (e) {
      return errorAResultado(e);
    }
  };

  return (
    <ProductosContext.Provider
      value={{
        productos,
        categorias,
        cargando,
        nombreCategoria,
        refrescar,
        agregarProducto,
        actualizarProducto,
        actualizarStock,
        eliminarProducto,
        agregarCategoria,
        actualizarCategoria,
        eliminarCategoria,
      }}
    >
      {children}
    </ProductosContext.Provider>
  );
};

export const useProductos = () => {
  const ctx = useContext(ProductosContext);
  if (!ctx) {
    throw new Error("useProductos requiere ProductosProvider");
  }
  return ctx;
};
