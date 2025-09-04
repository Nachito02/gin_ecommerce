import Banner from "@/components/Banner";
import Features from "@/components/Features";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductList from "@/components/ProductList";
import { Product } from "@/models/Product";


import ProductData from "../public/data/base_de_datos.json";

export default function Home() {

  const products: Product[] = ProductData.map((product: Product) => ({
    id: product.id,
    title: product.title,
    images: product.images,
    price: product.price,
    rating: product.rating,
    thumbnail: product.thumbnail,
    description: product.description,
    category: product.category,
    discountPercentage: product.discountPercentage,
  }));

  return (
    <div className="font-sans">
      <HeroSection />
      <Features />
      <ProductList title="Productos destacados" products={products} />
      <Banner />
      <ProductList title="Productos destacados" products={products} />

    </div>
  );
}
