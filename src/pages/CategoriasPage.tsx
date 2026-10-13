import { useState } from "react";
import { CategoriaForm } from "../components/CategoriaForm";
import { CategoriasTabla } from "../components/CategoriasTabla";
import { ConfirmModal } from "../components/ConfirmModal";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { useNotificaciones } from "../context/NotificacionesContext";
import { useProductos } from "../context/ProductosContext";
import type { Categoria } from "../types/Categoria";

/** Solo el administrador gestiona categorías. */
export const CategoriasPage = () => {
  const {
    productos,
    categorias,
    agregarCategoria,
    actualizarCategoria,
    eliminarCategoria,
  } = useProductos();
  const { notificar } = useNotificaciones();
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [porEliminar, setPorEliminar] = useState<Categoria | null>(null);

  const guardar = (nombre: string) => {
    if (editando) {
      const resultado = actualizarCategoria(editando.id, nombre);
      if (resultado.ok) {
        notificar(`Categoría "${nombre.trim()}" actualizada.`);
        setEditando(null);
      }
      return resultado;
    }
    const resultado = agregarCategoria(nombre);
    if (resultado.ok) notificar(`Categoría "${nombre.trim()}" creada.`);
    return resultado;
  };

  const confirmarEliminar = () => {
    if (!porEliminar) return;
    const resultado = eliminarCategoria(porEliminar.id);
    if (resultado.ok) {
      notificar(`Categoría "${porEliminar.nombre}" eliminada.`, "info");
      if (editando?.id === porEliminar.id) setEditando(null);
    } else {
      notificar(resultado.error, "danger");
    }
    setPorEliminar(null);
  };

  return (
    <>
      <PageHeader
        titulo="Gestión de categorías"
        descripcion="Crea, consulta, modifica y elimina las categorías del catálogo."
      />

      <div className="row g-4 align-items-start">
        <div className="col-12 col-lg-5">
          <Panel titulo={editando ? "Editar categoría" : "Nueva categoría"}>
            <CategoriaForm
              key={editando?.id ?? "nueva"}
              categorias={categorias}
              categoriaInicial={editando ?? undefined}
              onSubmit={guardar}
              onCancelar={editando ? () => setEditando(null) : undefined}
            />
          </Panel>
        </div>
        <div className="col-12 col-lg-7">
          <Panel titulo={`Categorías (${categorias.length})`}>
            <CategoriasTabla
              categorias={categorias}
              cantidadProductos={(id) =>
                productos.filter((p) => p.categoriaId === id).length
              }
              onEditar={setEditando}
              onEliminar={setPorEliminar}
            />
          </Panel>
        </div>
      </div>

      <ConfirmModal
        abierto={porEliminar !== null}
        titulo="Eliminar categoría"
        mensaje={`¿Seguro que deseas eliminar la categoría "${porEliminar?.nombre ?? ""}"?`}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
};
