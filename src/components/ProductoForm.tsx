import { useState, type FormEvent } from "react";
import type { Categoria } from "../types/Categoria";
import type { FormProducto, Producto } from "../types/Producto";
import type { Resultado } from "../types/Resultado";
import { validarFormProducto, type ErroresProducto } from "../utils/validaciones";
import { useProductos } from "../context/ProductosContext";
import { CampoSelect } from "./CampoSelect";
import { CampoTexto } from "./CampoTexto";
import { CampoTextarea } from "./CampoTextarea";

interface ProductoFormProps {
  modo: "crear" | "editar";
  productoInicial?: Producto;
  categorias: Categoria[];
  onSubmit: (producto: Producto) => Resultado;
  onCancelar?: () => void;
}

const valoresIniciales = (p?: Producto): FormProducto => ({
  id: p?.id ?? "",
  nombre: p?.nombre ?? "",
  categoriaId: p?.categoriaId ?? "",
  subcategoria: p?.subcategoria ?? "",
  marca: p?.marca ?? "",
  unidad: p?.unidad ?? "",
  precio: p ? String(p.precio) : "",
  stock: p ? String(p.stock) : "",
  stockMinimo: p ? String(p.stockMinimo) : "",
  descripcion: p?.descripcion ?? "",
  imagen: p?.imagen ?? "",
});

export const ProductoForm = ({
  modo,
  productoInicial,
  categorias,
  onSubmit,
  onCancelar,
}: ProductoFormProps) => {
  const { productos } = useProductos();
  const [valores, setValores] = useState<FormProducto>(() =>
    valoresIniciales(productoInicial),
  );
  const [errores, setErrores] = useState<ErroresProducto>({});
  const [errorGeneral, setErrorGeneral] = useState("");

  const actualizar = (campo: keyof FormProducto, valor: string) => {
    setValores((actuales) => ({ ...actuales, [campo]: valor }));
    setErrores((actuales) => ({ ...actuales, [campo]: undefined }));
    setErrorGeneral("");
  };

  const manejarEnvio = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nuevos = validarFormProducto(valores, modo, productos, categorias);
    setErrores(nuevos);
    if (Object.values(nuevos).some(Boolean)) {
      setErrorGeneral("Revisa los campos marcados en rojo.");
      return;
    }

    const producto: Producto = {
      id: valores.id.trim().toUpperCase(),
      nombre: valores.nombre.trim(),
      categoriaId: valores.categoriaId,
      subcategoria: valores.subcategoria.trim(),
      marca: valores.marca.trim(),
      unidad: valores.unidad.trim(),
      precio: Number(valores.precio),
      stock: Number(valores.stock),
      stockMinimo: Number(valores.stockMinimo),
      descripcion: valores.descripcion.trim(),
      imagen: valores.imagen.trim(),
    };

    const resultado = onSubmit(producto);
    if (!resultado.ok) {
      setErrorGeneral(resultado.error);
      return;
    }
    if (modo === "crear") setValores(valoresIniciales());
  };

  return (
    <form onSubmit={manejarEnvio} noValidate>
      {errorGeneral && (
        <div className="alert alert-danger" role="alert">
          {errorGeneral}
        </div>
      )}

      <CampoTexto
        id="producto-id"
        label="Código"
        value={valores.id}
        onChange={(v) => actualizar("id", v)}
        error={errores.id}
        deshabilitado={modo === "editar"}
        ayuda={modo === "editar" ? "El código no se puede modificar." : "Ej: HE001"}
        requerido
      />
      <CampoTexto
        id="producto-nombre"
        label="Nombre"
        value={valores.nombre}
        onChange={(v) => actualizar("nombre", v)}
        error={errores.nombre}
        requerido
      />
      <CampoSelect
        id="producto-categoria"
        label="Categoría"
        value={valores.categoriaId}
        placeholder="Seleccione una categoría"
        opciones={categorias.map((c) => ({ valor: c.id, etiqueta: c.nombre }))}
        onChange={(v) => actualizar("categoriaId", v)}
        error={errores.categoriaId}
        requerido
      />
      <div className="row">
        <div className="col-12 col-sm-6">
          <CampoTexto
            id="producto-subcategoria"
            label="Subcategoría"
            value={valores.subcategoria}
            onChange={(v) => actualizar("subcategoria", v)}
            error={errores.subcategoria}
            requerido
          />
        </div>
        <div className="col-12 col-sm-6">
          <CampoTexto
            id="producto-marca"
            label="Marca"
            value={valores.marca}
            onChange={(v) => actualizar("marca", v)}
            error={errores.marca}
            requerido
          />
        </div>
        <div className="col-12 col-sm-6">
          <CampoTexto
            id="producto-unidad"
            label="Unidad"
            value={valores.unidad}
            placeholder="Saco, Unidad, Galón..."
            onChange={(v) => actualizar("unidad", v)}
            error={errores.unidad}
            requerido
          />
        </div>
        <div className="col-12 col-sm-6">
          <CampoTexto
            id="producto-precio"
            label="Precio (CLP)"
            type="number"
            min="0"
            value={valores.precio}
            onChange={(v) => actualizar("precio", v)}
            error={errores.precio}
            requerido
          />
        </div>
        <div className="col-12 col-sm-6">
          <CampoTexto
            id="producto-stock"
            label="Stock"
            type="number"
            min="0"
            value={valores.stock}
            onChange={(v) => actualizar("stock", v)}
            error={errores.stock}
            requerido
          />
        </div>
        <div className="col-12 col-sm-6">
          <CampoTexto
            id="producto-stock-minimo"
            label="Stock mínimo"
            type="number"
            min="0"
            value={valores.stockMinimo}
            onChange={(v) => actualizar("stockMinimo", v)}
            error={errores.stockMinimo}
            requerido
          />
        </div>
      </div>
      <CampoTextarea
        id="producto-descripcion"
        label="Descripción"
        value={valores.descripcion}
        onChange={(v) => actualizar("descripcion", v)}
        error={errores.descripcion}
        requerido
      />
      <CampoTexto
        id="producto-imagen"
        label="Imagen"
        value={valores.imagen}
        onChange={(v) => actualizar("imagen", v)}
        ayuda="Opcional. URL de una imagen o nombre de un archivo existente (ej: MC001.png)."
      />

      <div className="d-flex flex-wrap gap-2">
        <button type="submit" className="btn btn-primary">
          {modo === "crear" ? "Crear producto" : "Guardar cambios"}
        </button>
        {onCancelar && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancelar}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};
