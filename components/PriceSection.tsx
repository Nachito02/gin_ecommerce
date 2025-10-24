"use client"; // Solo si realmente necesitás que esto se renderice del lado del cliente

import { FC } from "react";
import { getDiscount } from "@/utils/getDiscount";

const PriceSection: FC<{ price: number; discountPercentage: number}> = ({
  price,
  discountPercentage,
}) => {
  const discount = parseFloat(discountPercentage.toString());
  const finalPrice = getDiscount(price, discount);

  if (Math.floor(discount) === 0) {
    return <h2 className="font-medium  text-2xl">${price}</h2>;
  }

  return (
    <div className="leading-3">
      <h2 className="font-medium  text-3xl">
        ${finalPrice.toFixed(2)}
      </h2>
      <span className="mr-2 text-sm line-through opacity-70  text-black">
        ${price}
      </span>
      <span className="text-sm font-semibold text-red-600 ">
        -{discountPercentage}%
      </span>
    </div>
  );
};

export default PriceSection;
