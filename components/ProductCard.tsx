import { FC, memo, useMemo } from "react";
import Link from "next/link";
import RatingStar from "./RatingStart";
import PriceSection from "./PriceSection";
import { AiOutlineShoppingCart } from "react-icons/ai";

interface ProductCardInterface {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountPercentage?: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  images: string[];
  categories?: { id: string; name: string; slug: string }[];
  rating?: number;
}

const ProductCard: React.FC<ProductCardInterface> = memo(function ProductCard({
  id,
  title,
  slug,
  price,
  images,
  discountPercentage,
  categories,
  rating,
}) {
  const hasDiscount = typeof discountPercentage === "number" && discountPercentage > 0;

  // Imagen principal + “siguiente” del arreglo
  const [primarySrc, hoverSrc] = useMemo(() => {
    const first = images?.[0] ?? "/placeholder.png";
    const next = images?.[1] ?? first; // si no hay siguiente, reutiliza la primera
    return [first, next];
  }, [images]);

  return (
    <article className="group relative bg-white ring-1 ring-neutral-200/60 shadow-sm hover:shadow-md transition-shadow font-lato"
      data-test="product-card"
    >
      {/* Imagen */}
      <Link
        href={{ pathname: `/productos/${slug}` }}
        className="block overflow-hidden rounded-t-2xl"
      >
        <div className="relative w-full aspect-[4/3] bg-neutral-50">
          {/* base */}
          <img
            src={primarySrc}
            alt={title}
            className="absolute inset-0 h-full w-full object-contain
                       transition-transform duration-300 ease-out
                       group-hover:scale-[1.03]"
            loading="lazy"
          />

          {/* hover: siguiente del arreglo (cross-fade) */}
          <img
            src={hoverSrc}
            alt={`${title} (vista 2)`}
            className="absolute inset-0 h-full w-full object-contain
                       opacity-0 translate-y-1
                       transition-opacity duration-300 ease-out
                       group-hover:opacity-100 group-hover:translate-y-0
                       pointer-events-none"
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
        <div className="flex gap-0.5">
          {categories?.map((category) => (
          <p key={category.id} className="text-xs text-neutral-500 mb-0.5">
            {category.name}
          </p>
        ))}
        </div>

        <Link
          href={{ pathname: `/productos/${slug}` }}
          title={title}
          className="block text-sm font-semibold text-neutral-900 leading-snug overflow-hidden text-ellipsis whitespace-nowrap hover:underline capitalize"
        >
          {title}
        </Link>

        {!!rating && (
          <div className="mt-1 flex items-center gap-2">
            <RatingStar rating={rating} />
            <span className="text-xs text-neutral-500">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        <div className="mt-3 flex justify-between items-end gap-2">
          <div>
            <PriceSection
              discountPercentage={discountPercentage ?? 0}
              price={price}
            />
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