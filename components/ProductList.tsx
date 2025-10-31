"use client";

import { FC } from "react";
import { Product } from "../models/Product";
import ProductCard from "./ProductCard";

const ProductList: FC<{ title: string; products: Product[] }> = ({
  title,
  products,
}) => (
  <div className="container mt-8 mx-auto px-4 ">
    <div className="sm:flex items-center justify-between">
      <h2 className="text-4xl font-medium font-lora text-[#1f1f1f] ">
        {title}
      </h2>
    </div>
    <div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4"
      data-test="product-list-container"
    >
   
      {  products?.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          images={product.images}
          categories={product.categories}
          title={product.title}
          price={product.price}
          discountPercentage={product.discountPercentage}
          featured={product.featured}
          slug={product.slug}
          status={product.status}
        />
      )) }
    </div> 
  </div>
);

export default ProductList;
