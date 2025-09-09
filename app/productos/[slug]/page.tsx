"use client";

import { useParams } from "next/navigation"; // Importa useParams
import { Product } from "@/models/Product";
import RatingStar from "@/components/RatingStart";
import PriceSection from "@/components/PriceSection";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdFavoriteBorder } from "react-icons/md";
import ProductList from "@/components/ProductList";
import useCarritoStore from "@/hooks/useCarritoStore";
import { notFound, useRouter } from "next/navigation";
import data from "@/app/data/base_de_datos.json";
import { useMemo, useState } from "react";
import Button from "@/components/Button";

export default function ProductPage({ params: { slug } }: { params: { slug: string } }) {
  const router = useRouter();
  const agregarProducto = useCarritoStore((state) => state.agregarProducto);

  
  // Si no se encuentra el producto, redirigir a una página 404

  const product = useMemo(
    () => (data as Product[]).find((p) => String(p.id) === String(slug)),
    [slug]
  );
  if (!product) return notFound();

  const [image, setImage] = useState(product.thumbnail);
  const similar = useMemo(
    () => (data as Product[]).filter((p) => p.category === product.category && p.id !== product.id),
    [product]
  );

  const handleChangeImage = (img: string) => setImage(img);

  return (
    <div className="container mx-auto px-4 pb-28 md:pb-10 pt-6 font-karla">
      {/* Migas de pan */}
      <nav className="text-sm text-neutral-500 mb-3">
        <span className="hover:underline cursor-pointer" onClick={() => router.push("/")}>Inicio</span>
        <span className="mx-2">/</span>
        <span className="hover:underline cursor-pointer" onClick={() => router.push(`/c/${product.category}`)}>
          {product.category}
        </span>
        <span className="mx-2">/</span>
        <span className="text-neutral-700">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GALERÍA */}
        <section className="lg:col-span-6">
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/60 p-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-50">
              {/* imagen principal */}
              {/* Si usas next/image, cámbialo por <Image fill .../> */}
              <img
                src={image}
                alt={`Imagen principal de ${product.title}`}
                className="h-full w-full object-contain"
              />
            </div>

            {/* miniaturas */}
            <div className="mt-3 flex gap-2 overflow-auto">
              {product.images?.map((src) => {
                const selected = src === image;
                return (
                  <button
                    key={src}
                    onClick={() => handleChangeImage(src)}
                    className={[
                      "h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-neutral-100 ring-1 transition",
                      selected ? "ring-[#840c4a]" : "ring-transparent hover:ring-neutral-300"
                    ].join(" ")}
                    aria-label="Cambiar imagen"
                  >
                    <img src={src} alt={`Miniatura ${product.title}`} className="h-full w-full object-cover" />
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* DETALLE */}
        <section className="lg:col-span-3">
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/60 p-5">
            <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">{product.title}</h1>

            {/* meta (rating, vendidos, favoritos) */}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              {!!product.rating && (
                <div className="flex items-center gap-2">
                  <RatingStar rating={product.rating} />
                  <span className="text-neutral-500">({Math.max(12, Math.round(product.rating * 5))} opiniones)</span>
                </div>
              )}
              <span className="h-1 w-1 rounded-full bg-neutral-300" />
              <span className="text-emerald-600 font-medium">Stock: 1</span>
            </div>

            {/* precio + descuentos */}
            <div className="mt-4">
              <PriceSection
                discountPercentage={product.discountPercentage ?? 0}
                price={product.price}
              />
              {/* cuotas estilo ML */}
              <p className="mt-1 text-sm text-neutral-600">
                Hasta <span className="font-medium text-neutral-800">12x</span> sin interés con tarjeta seleccionada
              </p>
            </div>

            {/* badges / atributos rápidos */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs bg-[#840c4a]/10 text-[#840c4a]">
                {product.brand}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs bg-neutral-100 text-neutral-700">
                {product.category}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs bg-neutral-100 text-neutral-700">
                Garantía oficial
              </span>
            </div>

            {/* descripción resumida */}
            <div className="mt-5">
              <h2 className="text-base font-semibold text-neutral-900">Descripción</h2>
              <p className="mt-1 text-neutral-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* tabla de detalles */}
            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="text-neutral-500">Marca</div>
              <div className="text-neutral-800">{product.brand}</div>
              <div className="text-neutral-500">Categoría</div>
              <div className="text-neutral-800">{product.category}</div>
              <div className="text-neutral-500">Stock</div>
              <div className="text-neutral-800">{product.stock}</div>
            </div>
          </div>
        </section>

        {/* BOX DE COMPRA (sticky) */}
        <aside className="lg:col-span-3">
          <div className=" lg:top-20 rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/60 p-4">
            <div className="space-y-3">
              <div className="text-sm text-neutral-700">
                <span className="text-emerald-600 font-medium">Llega gratis</span> a tu domicilio
                <div className="text-neutral-500">Entre 2 y 5 días hábiles</div>
              </div>

              <div className="text-sm text-neutral-700">
                <span className="font-medium">Devolución gratis</span> dentro de 30 días
              </div>

              {/* CTA */}
              <div className="pt-2 space-y-2">
                <Button
                  label="Comprar ahora"
                  onClick={() => router.push("/checkout")}
                  // si tu Button soporta variant/size, ajusta acá
                />
                <Button
                  label="Agregar al carrito"
                  onClick={() =>agregarProducto(product)}
                  icon={AiOutlineShoppingCart}
                />

                <Button
                  label="Agregar a favortios"
                  onClick={() => router.push("/favoritos")}
                  icon={MdFavoriteBorder}
                />
               
              </div>

              {/* medios de pago */}
              <div className="pt-2 border-t border-neutral-200">
                <p className="text-sm text-neutral-600">
                  Pagá con tarjeta, débito o transferencia
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Tabs simples (podés evolucionarlo a tabs reales) */}
      <div className="mt-8 rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/60 p-5">
        <h3 className="text-lg font-semibold">Detalles del producto</h3>
        <p className="mt-2 text-neutral-700 leading-relaxed">
          Diseñado para espacios modernos. Materiales de alta calidad y terminaciones elegantes.
        </p>
      </div>

      {/* SIMILARES */}
      <div className="mt-8">
        <ProductList title="Productos similares" products={similar} />
      </div>

      {/* CTA móvil fijo */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-t border-neutral-200 p-3 lg:hidden">
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/favs")}
            className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 text-neutral-700"
          >
            <MdFavoriteBorder className="text-xl" />
            Favoritos
          </button>
          <button
            onClick={() => router.push("/cart")}
            className="flex-[2] h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#840c4a] text-white font-medium"
          >
            <AiOutlineShoppingCart className="text-xl" />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
