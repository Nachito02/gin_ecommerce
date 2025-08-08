import Link from "next/link";
import React from "react";

const HeroSection = () => {
  return (
    <div className="bg-[#e7dccd] font-lora">
      <div className="container px-4 grid md:grid-cols-2 py-8 mx-auto">
        <div className="flex items-center">
          <div className="max-w-[450px] space-y-4">
            <p className="text-black ">
              Solo por <span className="font-bold">$999</span>
            </p>
            <h2 className="text-black font-bold text-4xl md:text-5xl ">
              ¿Querés renovar tu comedor con estilo y calidad real?
            </h2>
            <h3 className="text-2xl ">
              Oferta exclusiva <span className="text-red-600">-10%</span> esta semana
            </h3>
            <Link
              href="/product/6"
              data-test="hero-btn"
              className="inline-block bg-white rounded-md px-6 py-3 hover:bg-blue-500 hover:text-white mb-4 md:mb-0"
            >
              Comprá ahora
            </Link>
          </div>
        </div>
        <div>
          <img src="/images/hero.jpg" alt="hero" className="ml-auto "  />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
