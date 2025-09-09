import { FC, memo } from "react";
import { Product } from "@/models/Product";
import Link from "next/link";
import RatingStar from "./RatingStart";
import PriceSection from "./PriceSection";
import { AiOutlineShoppingCart } from "react-icons/ai";
import useCarritoStore from "@/hooks/useCarritoStore";

const ProductCard: FC<Product> = memo(function ProductCard({
  id,
  price,
  thumbnail,
  title,
  category,
  rating,
  discountPercentage,
}) {
  const hasDiscount = typeof discountPercentage === "number" && discountPercentage > 0;
const agregarProducto = useCarritoStore((state) => state.agregarProducto);
  return (
    <article
      className="group relative rounded-2xl bg-white ring-1 ring-neutral-200/60 shadow-sm hover:shadow-md transition-shadow font-lato"
      data-test="product-card"
    >
      {/* Imagen */}
      <Link href={{ pathname: `/productos/${id}` }} className="block overflow-hidden rounded-t-2xl">
        <div className="relative w-full aspect-[4/3] bg-neutral-50">
          {/* Si usas next/image, reemplazá por <Image fill ... /> */}
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
          {hasDiscount && (
            <span className="absolute left-2 top-2 select-none rounded-md bg-[#840c4a] text-white text-xs font-semibold px-2 py-1">
              -{Math.round(discountPercentage!)}%
            </span>
          )}
        </div>
      </Link>

      {/* Contenido */}
      <div className="p-3">
        <p className="text-xs text-neutral-500 mb-0.5">{category}</p>

        <Link
          href={{ pathname: `/productos/${id}` }}
          title={title}
          className="block text-sm font-semibold text-neutral-900 leading-snug overflow-hidden text-ellipsis whitespace-nowrap hover:underline"
        >
          {title}
        </Link>

        {/* Rating compacto */}
        {!!rating && (
          <div className="mt-1 flex items-center gap-2">
            <RatingStar rating={rating} />
            <span className="text-xs text-neutral-500">{rating.toFixed(1)}</span>
          </div>
        )}

        {/* Precio + CTA */}
        <div className="mt-3 flex justify-between items-end gap-2">
          <div className="">
            <PriceSection discountPercentage={discountPercentage ?? 0} price={price} />
            {/* cuotas estilo ML */}
            <p className="mt-0.5 text-[11px] text-neutral-500">
              Hasta <span className="font-medium text-neutral-700">12x</span> sin interés
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl h-10 px-3 bg-black text-white text-sm font-medium hover:opacity-90 active:opacity-85 transition"
            onClick={() => console.log({ add: id })}
            data-test="add-cart-btn"
            title="Agregar al carrito"
            aria-label="Agregar al carrito"
          >
            <AiOutlineShoppingCart className="text-base" />
            <span className="hidden sm:inline">Agregar</span>
          </button>
        </div>
      </div>
    </article>
  );
});

export default ProductCard;
