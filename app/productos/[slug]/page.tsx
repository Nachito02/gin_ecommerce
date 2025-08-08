import { Product } from "@/models/Product";
import RatingStar from "@/components/RatingStart";
import PriceSection from "@/components/PriceSection";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { MdFavoriteBorder } from "react-icons/md";
import ProductList from "@/components/ProductList";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const res = await fetch(`https://dummyjson.com/products/${params.slug}`);
  const product = await res.json();

  return {
    title: product.title,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const productRes = await fetch(`https://dummyjson.com/products/${params.slug}`);
  if (!productRes.ok) return notFound();
  const product: Product = await productRes.json();

  const similarRes = await fetch(
    `https://dummyjson.com/products/category/${product.category}`
  );
  const similarData = await similarRes.json();
  const similar: Product[] = similarData.products.filter(
    (p: Product) => p.id !== product.id
  );

  const lorem =
    "It is important to take care of the patient, to be followed by the patient, but it will happen at such a time...";

  return (
    <div className="container mx-auto pt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 px-4 font-karla">
        <div>
          <img src={product.thumbnail} alt="selected" className="mb-2 w-1/2 place-self-center" />
          <div className="flex space-x-1 items-center">
            {product.images?.map((_img) => (
              <img
                key={_img}
                src={_img}
                alt="thumb"
                className="w-12 cursor-pointer hover:border-2 hover:border-black"
              />
            ))}
          </div>
        </div>
        <div className="px-2">
          <h2 className="text-2xl">{product.title}</h2>
          {product.rating && <RatingStar rating={product.rating} />}
          <div className="mt-1">
            <PriceSection
              discountPercentage={product.discountPercentage}
              price={product.price}
            />
          </div>
          <table className="mt-2">
            <tbody>
              <tr>
                <td className="pr-2 font-bold">Brand</td>
                <td>{product.brand}</td>
              </tr>
              <tr>
                <td className="pr-2 font-bold">Category</td>
                <td>{product.category}</td>
              </tr>
              <tr>
                <td className="pr-2 font-bold">Stock</td>
                <td>{product.stock}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-2">
            <h2 className="font-bold">About the product</h2>
            <p className="leading-5">{product.description} {lorem}</p>
          </div>
          <div className="flex flex-wrap items-center mt-4 mb-2">
            <button
              type="button"
              className="flex space-x-1 items-center mr-2 mb-2 hover:bg-pink-700 text-white py-2 px-4 rounded bg-pink-500"
              title="ADD TO CART"
            >
              <AiOutlineShoppingCart />
            </button>
            <button
              type="button"
              className="flex space-x-1 items-center mr-2 mb-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              title="BUY NOW"
            >
              <FaHandHoldingDollar />
            </button>
            <button
              type="button"
              className="flex space-x-1 items-center mb-2 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700"
              title="ADD TO WISHLIST"
            >
              <MdFavoriteBorder />
            </button>
          </div>
        </div>
      </div>
      <hr className="mt-4" />
      <ProductList title="Similar Products" products={similar} />
      <br />
    </div>
  );
}
