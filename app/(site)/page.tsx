import Features from "@/components/Features";
import HeroSection from "@/components/HeroSection";
import ProductList from "@/components/ProductList";
import { Product } from "@/models/Product";

import { getProducts } from "../actions/getProducts";

export default async function Home() {

  const products: Product[] = await getProducts() 

  return (
    <div className="font-sans">
      <HeroSection />
      <Features />
      <ProductList title="Productos destacados" products={products} />
      {/* <Banner /> */}

    </div>
  );
}
