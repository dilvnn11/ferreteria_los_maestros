interface PageHeaderProps {
  titulo: string;
  descripcion?: string;
}

export const PageHeader = ({ titulo, descripcion }: PageHeaderProps) => {
  return (
    <div className="page-header">
      <h1 className="page-header__titulo">{titulo}</h1>
      {descripcion && <p className="page-header__descripcion">{descripcion}</p>}
    </div>
  );
};
