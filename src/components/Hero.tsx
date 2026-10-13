interface HeroProps {
  titulo: string;
  texto: string;
  textoBoton: string;
  onClick: () => void;
}

export const Hero = ({ titulo, texto, textoBoton, onClick }: HeroProps) => {
  return (
    <section className="hero">
      <h1 className="hero__titulo">{titulo}</h1>
      <p className="hero__texto">{texto}</p>
      <button type="button" className="btn btn-info btn-lg" onClick={onClick}>
        {textoBoton}
      </button>
    </section>
  );
};
