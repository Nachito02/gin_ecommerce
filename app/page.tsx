import Banner from "@/components/Banner";
import Features from "@/components/Features";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProductList from "@/components/ProductList";
import { Product } from "@/models/Product";

export const dynamic = "force-dynamic"; // asegura que sea SSR en entornos con cache

export default async function Home() {
  const res = await fetch("https://dummyjson.com/products?limit=8", {
    next: { revalidate: 0 }, // siempre SSR (sin cache)
  });

  const data = await res.json();

  const products: Product[] = data.products.map((product: Product) => ({
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
