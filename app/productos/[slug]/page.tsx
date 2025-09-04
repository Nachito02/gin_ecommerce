import { Product } from "@/models/Product";
import RatingStar from "@/components/RatingStart";
import PriceSection from "@/components/PriceSection";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { MdFavoriteBorder } from "react-icons/md";
import ProductList from "@/components/ProductList";
import { notFound } from "next/navigation";

// Importamos el JSON directamente (asegurate que esté en app/data/)
import data from "@/app/data/base_de_datos.json";

// SEO dinámico
export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  const product = (data as Product[]).find(
    (p) => String(p.id) === String(slug)
  );

  if (!product) {
    return { title: "Producto no encontrado", description: "" };
  }

  return {
    title: product.title,
    description: product.description ?? "",
  };
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  const product = (data as Product[]).find(
    (p) => String(p.id) === String(slug)
  );

  if (!product) return notFound();

  // Filtrar productos similares
  const similar = (data as Product[]).filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  return (
    <div className="container mx-auto pt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 px-4 font-karla">
        {/* Imagen principal y miniaturas */}
        <div>
          <img
            src={product.thumbnail}
            alt={`Imagen principal de ${product.title}`}
            className="mb-2 w-1/2 place-self-center"
          />
          <div className="flex space-x-1 items-center">
            {product.images?.map((_img) => (
              <img
                key={_img}
                src={_img}
                alt={`Miniatura de ${product.title}`}
                className="w-12 cursor-pointer hover:border-2 hover:border-black"
              />
            ))}
          </div>
        </div>

        {/* Información del producto */}
        <div className="px-2">
          <h2 className="text-2xl">{product.title}</h2>
          {product.rating && <RatingStar rating={product.rating} />}
          <div className="mt-1">
            <PriceSection
              discountPercentage={product.discountPercentage ?? 0}
              price={product.price}
            />
          </div>

          {/* Tabla de detalles */}
          <table className="mt-2">
            <tbody>
              <tr>
                <td className="pr-2 font-bold">Marca</td>
                <td>{product.brand}</td>
              </tr>
              <tr>
                <td className="pr-2 font-bold">Categoría</td>
                <td>{product.category}</td>
              </tr>
              <tr>
                <td className="pr-2 font-bold">Stock</td>
                <td>{product.stock}</td>
              </tr>
            </tbody>
          </table>

          {/* Descripción */}
          <div className="mt-2">
            <h2 className="font-bold">Descripción del producto</h2>
            <p className="leading-5">{product.description}</p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap items-center mt-4 mb-2">
            <button
              type="button"
              className="flex space-x-1 items-center mr-2 mb-2 hover:bg-pink-700 text-white py-2 px-4 rounded bg-pink-500"
              title="Agregar al carrito"
            >
              <AiOutlineShoppingCart />
              <span>Agregar</span>
            </button>
            <button
              type="button"
              className="flex space-x-1 items-center mr-2 mb-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              title="Comprar ahora"
            >
              <FaHandHoldingDollar />
              <span>Comprar</span>
            </button>
            <button
              type="button"
              className="flex space-x-1 items-center mb-2 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700"
              title="Agregar a favoritos"
            >
              <MdFavoriteBorder />
              <span>Favoritos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Productos similares */}
      <hr className="mt-4" />
      <ProductList title="Productos similares" products={similar} />
      <br />
    </div>
  );
}