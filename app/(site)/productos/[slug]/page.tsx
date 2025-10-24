import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct } from "@/app/actions/getProduct";
import ProductList from "@/components/ProductList";
import ImageGalleryClient from "./ImageGalleryClient";
import BuyBoxClient from "./BuyBoxClient";
import { getSimilarProducts } from "@/app/actions/getSimiliarProducts";
import PriceSection from "@/components/PriceSection";

type Params = Promise<{ slug: string }>;

export default async function ProductPage(props: { params: Params }) {
  const { slug } = await props.params;

  const product = await getProduct(slug);
  if (!product) return notFound();

  const similar = await getSimilarProducts(
    product.id,
    product.categories?.map((c) => c.slug) ?? []
  );

  // La imagen principal la maneja el client component
  const thumbnails = product.images;

  return (
    <div className="container mx-auto px-4 pb-28 md:pb-10 pt-6 font-karla">
      {/* Migas de pan (usar Link en server está OK) */}
      <nav className="text-sm text-neutral-500 mb-3">
        <Link className="hover:underline" href="/">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        {product.categories?.[0] ? (
          <Link
            className="hover:underline"
            href={`/c/${product.categories[0].slug}`}
          >
            {product.categories[0].name}
          </Link>
        ) : (
          <span className="text-neutral-700">Sin categoría</span>
        )}
        <span className="mx-2">/</span>
        <span className="text-neutral-700">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GALERÍA (Client) */}
        <section className="lg:col-span-7">
          <ImageGalleryClient images={thumbnails} title={product.title} />
        </section>

        {/* BOX DE COMPRA (Client: router + store) */}
        <aside className="lg:col-span-5">
          <section className="lg:col-span-3">
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/60 p-5">
              <h1 className="text-2xl md:text-3xl font-semibold capitalize text-neutral-900">
                {product.title}
              </h1>

              {/* Meta simple */}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <span className="text-emerald-600 font-medium">
                  Stock: {product.stock}
                </span>
              </div>

              <PriceSection
                price={product.price}
                discountPercentage={product.discountPercentage ?? 0}
              />

              {/* badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {product.categories?.map((c) => (
                  <span
                    key={c.id}
                    className="px-2.5 py-1 rounded-full text-xs bg-neutral-100 text-neutral-700"
                  >
                    {c.name}
                  </span>
                ))}
              </div>

              {/* descripción */}
              {!!product.description && (
                <div className="mt-5">
                  <h2 className="text-base font-semibold text-neutral-900">
                    Descripción
                  </h2>
                  <p className="mt-1 text-neutral-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* tabla de detalles (ejemplo con medidas) */}
              <div className="mt-5 grid grid-cols-4 gap-x-6 gap-y-2 text-sm">
                <div className="text-neutral-500">Ancho</div>
                <div className="text-neutral-800">{product.widthCm ?? "-"}</div>
                <div className="text-neutral-500">Profundidad</div>
                <div className="text-neutral-800">{product.depthCm ?? "-"}</div>
                <div className="text-neutral-500">Alto</div>
                <div className="text-neutral-800">
                  {product.heightCm ?? "-"}
                </div>
                <div className="text-neutral-500">Peso</div>
                <div className="text-neutral-800">
                  {product.weightKg ?? "-"}
                </div>
              </div>
            </div>
          </section>
          <BuyBoxClient product={product} />
        </aside>
      </div>

      {/* SIMILARES */}
      <div className="mt-8">
        <ProductList title="Productos similares" products={similar} />
      </div>
    </div>
  );
}
