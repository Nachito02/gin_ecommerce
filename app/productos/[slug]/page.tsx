"use client";

import { useParams } from "next/navigation"; // Importa useParams
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/models/Product";
import RatingStar from "@/components/RatingStart";
import PriceSection from "@/components/PriceSection";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdFavoriteBorder } from "react-icons/md";
import ProductList from "@/components/ProductList";
import Button from "@/components/Button";
import useCarritoStore from "@/hooks/useCarritoStore";
import { notFound } from "next/navigation";
import data from "@/app/data/base_de_datos.json";

export default function ProductPage() {
  // Usar useParams para acceder a los parámetros de la URL
  const params = useParams();
  const { slug } = params;
  const router = useRouter();
  const agregarProducto = useCarritoStore((state) => state.agregarProducto);

  // Buscar el producto por el slug
  const product = (data as Product[]).find((p) => String(p.id) === String(slug));
  const [image, setImage] = useState(product?.thumbnail);

  // Si no se encuentra el producto, redirigir a una página 404
  if (!product) return notFound();

  // Filtrar productos similares
  const similar = (data as Product[]).filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  // Cambiar imagen cuando se haga clic en la miniatura
  const handleChangeImage = (img: string) => setImage(img);

  return (
    <div className="container mx-auto pt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 px-4 font-karla">
        {/* Imagen principal y miniaturas */}
        <div className="flex flex-col gap-2 mr-10">
          <img
            src={image}
            alt={`Imagen principal de ${product.title}`}
            className="mb-2 place-self-center w-full max-h-[800px] object-contain"
          />
          <div className="flex space-x-1 items-center justify-center mr-10">
            {product.images?.map((img) => (
              <img
                key={img}
                src={img}
                alt={`Miniatura de ${product.title}`}
                onClick={() => handleChangeImage(img)}
                className="w-12 cursor-pointer hover:border-2 hover:border-black max-h-[800px] object-contain"
              />
            ))}
          </div>
        </div>

        {/* Información del producto */}
        <div className="px-2 flex justify-center">
          <div>
            <h2 className="md:text-6xl text-5xl mt-10">{product.title}</h2>
            {product.rating && (
              <div className="mt-2">
                <RatingStar rating={product.rating} />
              </div>
            )}
            <div className="mt-2">
              <PriceSection
                discountPercentage={product.discountPercentage ?? 0}
                price={product.price}
              />
            </div>

            {/* Tabla de detalles */}
            <table className="mt-2">
              <tbody>
                <tr>
                  <td className="pr-2 text-xl font-bold">Marca</td>
                  <td className="text-xl">{product.brand}</td>
                </tr>
                <tr>
                  <td className="pr-2 text-xl font-bold">Categoría</td>
                  <td className="text-xl">{product.category}</td>
                </tr>
                <tr>
                  <td className="pr-2 text-xl font-bold">Stock</td>
                  <td className="text-xl">{product.stock}</td>
                </tr>
              </tbody>
            </table>

            {/* Descripción */}
            <div className="mt-2">
              <h2 className="text-xl">Descripción del producto</h2>
              <p className="text-2xl mt-2">{product.description}</p>
            </div>

            {/* Botones de acción */}
            <div className="lg:flex items-center mt-4 mb-2 space-x-4">
              <Button
                label="Agregar al carrito"
                onClick={() => {
                  // Agregar producto al carrito
                  agregarProducto({
                    id: product.id,
                    title: product.title,
                    price: `$${product.price.toLocaleString("es-AR")}`,
                    thumbnail: product.thumbnail,
                  });

                  // Imprimir en consola detalles del producto agregado
                  console.log("Producto agregado:", {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    thumbnail: product.thumbnail,
                  });
                  console.log("Carrito actual:", useCarritoStore.getState().productos);
                }}
                icon={AiOutlineShoppingCart}
              />

              <Button
                label="Favoritos"
                onClick={() => router.push("/favs")}
                icon={MdFavoriteBorder}
              />
            </div>
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
