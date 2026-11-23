import { createContext, useContext, useMemo, type ReactNode } from "react";
import { crearCompra } from "../api/compras";
import { ApiException } from "../api/client";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { ItemCarrito, LineaCarrito } from "../types/Carrito";
import type { Resultado } from "../types/Resultado";
import { exitoVacio, fallo } from "../utils/resultado";
import { useProductos } from "./ProductosContext";

interface CarritoContextType {
  lineas: LineaCarrito[];
  total: number;
  cantidadTotal: number;
  agregar: (productoId: string, cantidad?: number) => Resultado;
  aumentar: (productoId: string) => Resultado;
  disminuir: (productoId: string) => void;
  eliminar: (productoId: string) => void;
  vaciar: () => void;
  /** Envía la compra al backend (descuenta stock real) y vacía el carrito si tiene éxito. */
  finalizarCompra: () => Promise<Resultado>;
}

const CarritoContext = createContext<CarritoContextType | null>(null);

export const CarritoProvider = ({ children }: { children: ReactNode }) => {
  const { productos, refrescar } = useProductos();
  const [items, setItems] = useLocalStorage<ItemCarrito[]>(
    "ferreteria:carrito",
    [],
  );

  // El carrito solo guarda id y cantidad; precio y nombre se leen del producto vigente
  const lineas = useMemo<LineaCarrito[]>(
    () =>
      items.flatMap((item) => {
        const producto = productos.find((p) => p.id === item.productoId);
        return producto
          ? [
              {
                producto,
                cantidad: item.cantidad,
                subtotal: producto.precio * item.cantidad,
              },
            ]
          : [];
      }),
    [items, productos],
  );

  const total = lineas.reduce((suma, l) => suma + l.subtotal, 0);
  const cantidadTotal = lineas.reduce((suma, l) => suma + l.cantidad, 0);

  const agregar = (productoId: string, cantidad = 1) => {
    const producto = productos.find((p) => p.id === productoId);
    if (!producto || producto.stock <= 0) {
      return fallo("Producto sin stock disponible.");
    }
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      return fallo("La cantidad debe ser un número entero mayor a 0.");
    }
    if (cantidad > producto.stock) {
      return fallo("No hay suficiente stock.");
    }

    const existente = items.find((i) => i.productoId === productoId);
    if (existente) {
      if (existente.cantidad + cantidad > producto.stock) {
        return fallo(
          `No puedes agregar más unidades de este producto. Ya tienes ${existente.cantidad} en el carrito y el stock es ${producto.stock}.`,
        );
      }
      setItems(
        items.map((i) =>
          i.productoId === productoId
            ? { ...i, cantidad: i.cantidad + cantidad }
            : i,
        ),
      );
    } else {
      setItems([...items, { productoId, cantidad }]);
    }
    return exitoVacio();
  };

  const aumentar = (productoId: string) => {
    const producto = productos.find((p) => p.id === productoId);
    const item = items.find((i) => i.productoId === productoId);
    if (!producto || !item || item.cantidad >= producto.stock) {
      return fallo("No hay más stock disponible de este producto.");
    }
    setItems(
      items.map((i) =>
        i.productoId === productoId ? { ...i, cantidad: i.cantidad + 1 } : i,
      ),
    );
    return exitoVacio();
  };

  const disminuir = (productoId: string) => {
    setItems(
      items.map((i) =>
        i.productoId === productoId && i.cantidad > 1
          ? { ...i, cantidad: i.cantidad - 1 }
          : i,
      ),
    );
  };

  const eliminar = (productoId: string) => {
    setItems(items.filter((i) => i.productoId !== productoId));
  };

  const vaciar = () => setItems([]);

  const finalizarCompra = async () => {
    if (lineas.length === 0) return fallo("El carrito está vacío.");

    const aComprar = lineas.map((l) => ({
      productoId: l.producto.id,
      cantidad: l.cantidad,
    }));

    try {
      await crearCompra(aComprar);
      setItems([]);
      // Actualiza el stock mostrado en el catálogo
      await refrescar();
      return exitoVacio();
    } catch (e) {
      if (e instanceof ApiException) return fallo(e.message);
      if (e instanceof Error) return fallo(e.message);
      return fallo("No se pudo registrar la compra. Intenta de nuevo.");
    }
  };

  return (
    <CarritoContext.Provider
      value={{
        lineas,
        total,
        cantidadTotal,
        agregar,
        aumentar,
        disminuir,
        eliminar,
        vaciar,
        finalizarCompra,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const contexto = useContext(CarritoContext);
  if (contexto === null) {
    throw new Error("useCarrito requiere CarritoProvider");
  }
  return contexto;
};
