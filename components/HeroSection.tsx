import Link from "next/link";
// Si preferís next/image y tu imagen es local, podés usarlo sin config extra:
// import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative mt-10 md:mt-0 font-lora bg-[#e7dccd]">
      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Copy */}
          <div className="max-w-xl">
            {/* Pill promo */}
            <div className="inline-flex items-center gap-2 rounded-full ring-1 bg-black  text-white ring-black/5 px-4 py-2 text-sm">
              <span className="inline-block h-2 w-2 rounded-full " />
              Oferta de la semana: <span className="font-semibold text-red-600">-10%</span>
            </div>

            <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight text-neutral-900">
              Renová tu comedor con estilo <span className="text-[#840c4a]">y calidad real</span>
            </h1>

            <p className="mt-3 text-lg text-neutral-700">
              Confort, materiales nobles y terminaciones elegantes. Llevate el set completo
              desde <span className="font-semibold text-neutral-900">$999</span>.
            </p>

            {/* Beneficios */}
            <ul className="mt-5 flex flex-wrap gap-3  text-sm text-neutral-700">
              <li className="inline-flex items-center gap-2 rounded-full bg-black ring-1 text-white ring-black/5  px-4 py-3">
                🚚 Envío a todo el país
              </li>
              <li className="inline-flex items-center gap-2 rounded-full bg-black text-white ring-1 ring-black/5  px-4 py-3">
                💳 Hasta 12x sin interés
              </li>
              <li className="inline-flex items-center gap-2 rounded-full bg-black text-white ring-1 ring-black/5  px-4 py-3">
                🔄 Devolución en 30 días
              </li>
            </ul>

            {/* CTAs */}
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/productos/silla-nordica"
                data-test="hero-btn"
                className="inline-flex justify-center items-center h-12 px-6 py-2 rounded-xl bg-black text-white font-medium shadow-sm hover:opacity-90 transition"
              >
                Comprá ahora
              </Link>
              <Link
                href="/catalogo"
                className="inline-flex  py-2 justify-center items-center h-12 px-6 rounded-xl bg-white text-black ring-1 ring-black/5 hover:bg-white transition"
              >
                Ver catálogo
              </Link>
            </div>

            {/* Aviso pequeño */}
            <p className="mt-3 text-xs text-neutral-600">
              Stock limitado. Promoción válida hasta agotar unidades.
            </p>
          </div>

          {/* Imagen / Visual */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-sm bg-white/60">
              {/* Si usás next/image:
              <Image src="/images/hero.jpg" alt="Comedor moderno" width={1200} height={900} className="w-full h-auto object-cover" priority />
              */}
              <img
                src="/images/hero.jpg"
                alt="Comedor moderno"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Card flotante */}
            <div className="absolute -bottom-4 right-4 left-auto rounded-xl bg-white/90 backdrop-blur p-3 ring-1 ring-black/5 shadow-sm hidden md:flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#840c4a]/10 flex items-center justify-center text-[#840c4a] text-lg">
                ★
              </div>
              <div className="text-sm">
                <div className="font-semibold text-neutral-900">Calidad verificada</div>
                <div className="text-neutral-600">+4.8 ⭐ en reseñas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* banda sutil inferior */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/5 to-transparent" />
    </section>
  );
};

export default HeroSection;
