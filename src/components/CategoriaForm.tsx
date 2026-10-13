import { useState, type FormEvent } from "react";
import type { Categoria } from "../types/Categoria";
import type { Resultado } from "../types/Resultado";
import { validarNombreCategoria } from "../utils/validaciones";
import { CampoTexto } from "./CampoTexto";

interface CategoriaFormProps {
  categorias: Categoria[];
  categoriaInicial?: Categoria;
  onSubmit: (nombre: string) => Resultado;
  onCancelar?: () => void;
}

export const CategoriaForm = ({
  categorias,
  categoriaInicial,
  onSubmit,
  onCancelar,
}: CategoriaFormProps) => {
  const [nombre, setNombre] = useState(categoriaInicial?.nombre ?? "");
  const [error, setError] = useState("");

  const manejarEnvio = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errorNombre = validarNombreCategoria(
      nombre,
      categorias,
      categoriaInicial?.id,
    );
    if (errorNombre) {
      setError(errorNombre);
      return;
    }
    const resultado = onSubmit(nombre);
    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }
    if (!categoriaInicial) setNombre("");
  };

  return (
    <form onSubmit={manejarEnvio} noValidate>
      <CampoTexto
        id="categoria-nombre"
        label="Nombre de la categoría"
        value={nombre}
        onChange={(valor) => {
          setNombre(valor);
          setError("");
        }}
        error={error}
        requerido
      />
      <div className="d-flex flex-wrap gap-2">
        <button type="submit" className="btn btn-primary">
          {categoriaInicial ? "Guardar cambios" : "Crear categoría"}
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
