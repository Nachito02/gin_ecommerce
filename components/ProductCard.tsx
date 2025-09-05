import { FC } from "react";
import { Product } from "@/models/Product";
import Link from "next/link";
import RatingStar from "./RatingStart";
import PriceSection from "./PriceSection";
import { AiOutlineShoppingCart } from "react-icons/ai";

const ProductCard: FC<Product> = ({
  id,
  price,
  thumbnail,
  title,
  category,
  rating,
  discountPercentage,
}) => {
  return (
    <div className="border border-gray-200 font-lato" data-test="product-card">
      <div className="text-center border-b border-gray-200">
        <Link href={{ pathname: `/productos/${id}` }}>
          <img
            src={thumbnail}
            alt={title}
            className="inline-block  transition-transform duration-200 hover:scale-110 w-full h-full "
          />
        </Link>
      </div>
      <div className="px-4 pt-4">
        <p className="text-gray-500 text-[14px] font-medium ">{category}</p>
        <Link
          className="font-semibold hover:underline  overflow-hidden text-ellipsis whitespace-nowrap block"
          href={{ pathname: `/productos/${id}` }}
          title={title}
        >
          {title}
        </Link>
      </div>
      <div className="px-4">
        <RatingStar rating={rating} />
      </div>
      <div className="flex flex-wrap items-center justify-between px-4 pb-4">
        {discountPercentage && (
          <PriceSection discountPercentage={discountPercentage} price={price} />
        )}
        <button
          type="button"
          className="flex items-center space-x-2 hover:bg-blue-500 text-white py-2 px-4 rounded bg-[#1f1f1f]"
          onClick={(addCart) => console.log(addCart)}
          data-test="add-cart-btn"
          title="ADD TO CART"
        >
          <AiOutlineShoppingCart />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
