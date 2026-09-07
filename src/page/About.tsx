import { Link } from "react-router-dom";

const About = () => {
  return (
    <section className="min-h-screen w-full bg-white-semi text-brown-pc px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase font-medium mb-3">
            Nuestra historia
          </p>
          <h1 className="text-4xl md:text-5xl font-bold">¿QUIÉNES SOMOS?</h1>
          <div className="w-16 h-1 bg-amber-950 mx-auto mt-5 rounded-full"></div>
          <p className="max-w-3xl mx-auto mt-6 text-base md:text-lg font-normal leading-relaxed text-brown-pc/80">
            Somos una empresa con más de 10 años en el mercado de las flores en
            Santiago de Chile. Durante este tiempo nos hemos distinguido por
            nuestro compromiso con el servicio y por hacer de cada momento una
            experiencia especial.
          </p>
        </div>

     {/* Información */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visión */}
          <article
            className="bg-amber-50/60 rounded-2xl p-8 md:p-10
                              border border-amber-900/10
                              shadow-sm
                              hover:shadow-md
                              hover:-translate-y-1
                              transition-all duration-300"
          >
            <h2 className="text-2xl font-bold mt-3 mb-5">VISIÓN</h2>

            <p className="text-base font-normal leading-7 text-brown-pc/80">
              Cumplir las expectativas de nuestros clientes para que, por medio
              de nuestro amplio catálogo, puedan expresar sentimientos y
              emociones a esos seres especiales.
            </p>
          </article>

          {/* Misión */}
          <article
            className="bg-amber-50/60 rounded-2xl p-8 md:p-10
                              border border-amber-900/10
                              shadow-sm
                              hover:shadow-md
                              hover:-translate-y-1
                              transition-all duration-300"
          >
           

            <h2 className="text-2xl font-bold mt-3 mb-5">MISIÓN</h2>

            <p className="text-base font-normal leading-7 text-brown-pc/80">
              Ser la floristería más reconocida en Santiago de Chile por
              nuestros servicios e innovaciones en el arte floral.
            </p>
          </article>
        </div>

        {/* Frase final */}
        <div className="text-center mt-16">
          <p className="text-xl md:text-2xl italic font-normal">
            “Hacemos de cada momento un recuerdo especial.”
          </p>
        </div> 
        <Link
          to="/"
          className="absolute top-6 left-10 items-center gap-2 text-sm font-semibold
          uppercase tracking-wider text-brown-pc/60
          transition-colors duration-300 hover:text-amber-950"
        >
          ← Volver a la tienda
        </Link>
      </div>
    </section>
  );
};

export default About;
