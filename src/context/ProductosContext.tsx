import { createContext, useContext, type ReactNode } from "react";
import { categoriasIniciales } from "../data/categorias";
import { productosIniciales } from "../data/productos";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Categoria } from "../types/Categoria";
import type { ItemCarrito } from "../types/Carrito";
import type { Producto } from "../types/Producto";
import type { Resultado } from "../types/Resultado";
import { exitoVacio, fallo } from "../utils/resultado";
import { useAuth } from "./AuthContext";

interface ProductosContextType {
  productos: Producto[];
  categorias: Categoria[];
  nombreCategoria: (id: string) => string;
  agregarProducto: (producto: Producto) => Resultado;
  actualizarProducto: (id: string, cambios: Omit<Producto, "id">) => Resultado;
  actualizarStock: (id: string, stock: number) => Resultado;
  eliminarProducto: (id: string) => Resultado;
  descontarStock: (items: ItemCarrito[]) => Resultado;
  agregarCategoria: (nombre: string) => Resultado;
  actualizarCategoria: (id: string, nombre: string) => Resultado;
  eliminarCategoria: (id: string) => Resultado;
}

const ProductosContext = createContext<ProductosContextType | null>(null);

export const ProductosProvider = ({ children }: { children: ReactNode }) => {
  const { permisos } = useAuth();
  const [productos, setProductos] = useLocalStorage<Producto[]>(
    "ferreteria:productos",
    productosIniciales,
  );
  const [categorias, setCategorias] = useLocalStorage<Categoria[]>(
    "ferreteria:categorias",
    categoriasIniciales,
  );

  const nombreCategoria = (id: string) =>
    categorias.find((c) => c.id === id)?.nombre ?? "Sin categoría";

  // ---------- Productos ----------

  const agregarProducto = (producto: Producto) => {
    if (!permisos.crearProductos) {
      return fallo("No tienes permisos para crear productos.");
    }
    if (productos.some((p) => p.id.toLowerCase() === producto.id.toLowerCase())) {
      return fallo("Ya existe un producto con ese código.");
    }
    setProductos([...productos, producto]);
    return exitoVacio();
  };

  const actualizarProducto = (id: string, cambios: Omit<Producto, "id">) => {
    if (!permisos.editarProductos) {
      return fallo("No tienes permisos para modificar productos.");
    }
    if (!productos.some((p) => p.id === id)) {
      return fallo("El producto ya no existe.");
    }
    setProductos(productos.map((p) => (p.id === id ? { ...p, ...cambios } : p)));
    return exitoVacio();
  };

  // Administrador y vendedor pueden ajustar el stock
  const actualizarStock = (id: string, stock: number) => {
    if (!permisos.modificarStock) {
      return fallo("No tienes permisos para modificar el stock.");
    }
    if (!Number.isInteger(stock) || stock < 0) {
      return fallo("El stock debe ser un número entero igual o mayor a 0.");
    }
    if (!productos.some((p) => p.id === id)) {
      return fallo("El producto ya no existe.");
    }
    setProductos(productos.map((p) => (p.id === id ? { ...p, stock } : p)));
    return exitoVacio();
  };

  const eliminarProducto = (id: string) => {
    if (!permisos.eliminarProductos) {
      return fallo("No tienes permisos para eliminar productos.");
    }
    setProductos(productos.filter((p) => p.id !== id));
    return exitoVacio();
  };

  // Lo usa el carrito al finalizar la compra (cualquier rol puede comprar)
  const descontarStock = (items: ItemCarrito[]) => {
    for (const item of items) {
      const producto = productos.find((p) => p.id === item.productoId);
      if (!producto || producto.stock < item.cantidad) {
        return fallo(
          `Stock insuficiente para "${producto?.nombre ?? item.productoId}". Disponible: ${producto?.stock ?? 0}`,
        );
      }
    }
    setProductos(
      productos.map((p) => {
        const item = items.find((i) => i.productoId === p.id);
        return item ? { ...p, stock: Math.max(0, p.stock - item.cantidad) } : p;
      }),
    );
    return exitoVacio();
  };

  // ---------- Categorías ----------

  const existeNombre = (nombre: string, idExcluido?: string) =>
    categorias.some(
      (c) =>
        c.id !== idExcluido &&
        c.nombre.toLowerCase() === nombre.trim().toLowerCase(),
    );

  const agregarCategoria = (nombre: string) => {
    if (!permisos.gestionarCategorias) {
      return fallo("No tienes permisos para administrar categorías.");
    }
    if (existeNombre(nombre)) {
      return fallo("Ya existe una categoría con ese nombre.");
    }
    setCategorias([...categorias, { id: `cat-${Date.now()}`, nombre: nombre.trim() }]);
    return exitoVacio();
  };

  const actualizarCategoria = (id: string, nombre: string) => {
    if (!permisos.gestionarCategorias) {
      return fallo("No tienes permisos para administrar categorías.");
    }
    if (existeNombre(nombre, id)) {
      return fallo("Ya existe una categoría con ese nombre.");
    }
    // Los productos referencian la categoría por id, así que el cambio se refleja solo
    setCategorias(
      categorias.map((c) => (c.id === id ? { ...c, nombre: nombre.trim() } : c)),
    );
    return exitoVacio();
  };

  const eliminarCategoria = (id: string) => {
    if (!permisos.gestionarCategorias) {
      return fallo("No tienes permisos para administrar categorías.");
    }
    const enUso = productos.filter((p) => p.categoriaId === id).length;
    if (enUso > 0) {
      return fallo(
        `No se puede eliminar: hay ${enUso} producto(s) en esta categoría. Muévelos o elimínalos primero.`,
      );
    }
    setCategorias(categorias.filter((c) => c.id !== id));
    return exitoVacio();
  };

  return (
    <ProductosContext
      value={{
        productos,
        categorias,
        nombreCategoria,
        agregarProducto,
        actualizarProducto,
        actualizarStock,
        eliminarProducto,
        descontarStock,
        agregarCategoria,
        actualizarCategoria,
        eliminarCategoria,
      }}
    >
      {children}
    </ProductosContext>
  );
};

export const useProductos = () => {
  const contexto = useContext(ProductosContext);
  if (contexto === null) {
    throw new Error("useProductos requiere ProductosProvider");
  }
  return contexto;
};
