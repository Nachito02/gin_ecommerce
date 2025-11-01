import { getProducts } from "../../actions/getProducts";
import type { Product } from "@/models/Product";
import CatalogView from "@/components/catalog/CatalogView";

export default async function CatalogoPage() {
  const products: Product[] = await getProducts();


  const categories = Array.from(
    products
      .flatMap((product) => product.categories ?? [])
      .reduce<Map<string, { id: string; name: string; slug: string }>>((acc, category) => {
        if (!acc.has(category.id)) {
          acc.set(category.id, { id: category.id, name: category.name, slug: category.slug });
        }
        return acc;
      }, new Map())
      .values()
  );

  const priceValues = products.map((product) => product.price);
  const priceRange = priceValues.length
    ? { min: Math.min(...priceValues), max: Math.max(...priceValues) }
    : { min: 0, max: 0 };

  return (
    <CatalogView
      products={products}
      categories={categories}
      priceRange={priceRange}
    />
  );
}
