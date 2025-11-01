"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/models/Product";
import ProductCard from "../ProductCard";
import { getDiscount } from "@/utils/getDiscount";

type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
};

type CatalogViewProps = {
  products: Product[];
  categories: CatalogCategory[];
  priceRange: { min: number; max: number };
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CatalogView({
  products,
  categories,
  priceRange,
}: CatalogViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(priceRange.min);
  const [maxPrice, setMaxPrice] = useState(priceRange.max);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setMinPrice(priceRange.min);
    setMaxPrice(priceRange.max);
    setOnlyDiscounted(false);
    setOnlyAvailable(false);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const discount = Number(product.discountPercentage ?? 0);
      const finalPrice = getDiscount(product.price, discount);

      if (onlyAvailable && product.stock <= 0) {
        return false;
      }

      if (onlyDiscounted && discount <= 0) {
        return false;
      }

      if (searchTerm.trim()) {
        const query = searchTerm.trim().toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesDescription = product.description
          ?.toLowerCase()
          .includes(query);
        const matchesCategory = product.categories?.some((category) =>
          category.name.toLowerCase().includes(query)
        );

        if (!matchesTitle && !matchesDescription && !matchesCategory) {
          return false;
        }
      }

      if (selectedCategories.length > 0) {
        const belongsToSelectedCategory = product.categories?.some((category) =>
          selectedCategories.includes(category.id)
        );

        if (!belongsToSelectedCategory) {
          return false;
        }
      }

      if (Number.isFinite(minPrice) && finalPrice < minPrice) {
        return false;
      }

      if (Number.isFinite(maxPrice) && finalPrice > maxPrice) {
        return false;
      }

      return true;
    });
  }, [
    products,
    selectedCategories,
    minPrice,
    maxPrice,
    onlyDiscounted,
    onlyAvailable,
    searchTerm,
  ]);

  const totalItems = filteredProducts.length;

  return (
    <div className="bg-neutral-50 min-h-screen pb-16 pt-12">
      <div className="container mx-auto px-4 lg:px-6">
        <header className="mb-12 flex flex-col gap-3 text-center">
          <span className="text-sm uppercase tracking-[0.3em] text-neutral-500">
            Nuestra selección
          </span>
          <h1 className="font-lora text-4xl sm:text-5xl text-neutral-900">
            Catálogo completo
          </h1>
          <p className="max-w-2xl mx-auto text-neutral-600">
            Encontrá la pieza ideal para cada ambiente. Filtrá por categoría,
            precio o promociones y descubrí nuestras últimas novedades.
          </p>
        </header>

        <div className="flex flex-row gap-8 ">
          <aside className="space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-200/60">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900">
                  Filtros
                </h2>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-sm font-medium text-[#840c4a] hover:opacity-80"
                >
                  Limpiar
                </button>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Ajustá tu búsqueda para encontrar lo que necesitás.
              </p>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="catalog-search"
                className="text-sm font-medium text-neutral-700"
              >
                Buscar
              </label>
              <input
                id="catalog-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Nombre, categoría, etc."
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-800 outline-none transition focus:border-neutral-400 focus:bg-white"
              />
            </div>

            {categories.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-800">
                  Categorías
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                  {categories.map((category) => {
                    const checked = selectedCategories.includes(category.id);
                    return (
                      <li key={category.id}>
                        <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-neutral-50">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-neutral-300 text-[#840c4a] focus:ring-[#840c4a]"
                            checked={checked}
                            onChange={() => toggleCategory(category.id)}
                          />
                          <span className="capitalize">
                            {category.name.toLowerCase()}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-neutral-800">Precio</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="text-xs font-medium text-neutral-500">
                  Mínimo
                  <input
                    type="number"
                    value={minPrice}
                    min={priceRange.min}
                    max={maxPrice}
                    onChange={(event) => {
                      const raw = event.target.value;
                      const value = raw === "" ? priceRange.min : Number(raw);
                      if (Number.isNaN(value)) {
                        setMinPrice(priceRange.min);
                        return;
                      }
                      const next = Math.max(
                        priceRange.min,
                        Math.min(value, maxPrice)
                      );
                      setMinPrice(next);
                    }}
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-800 outline-none focus:border-neutral-400 focus:bg-white"
                  />
                </label>
                <label className="text-xs font-medium text-neutral-500">
                  Máximo
                  <input
                    type="number"
                    value={maxPrice}
                    min={minPrice}
                    max={priceRange.max}
                    onChange={(event) => {
                      const raw = event.target.value;
                      const value = raw === "" ? priceRange.max : Number(raw);
                      if (Number.isNaN(value)) {
                        setMaxPrice(priceRange.max);
                        return;
                      }
                      const next = Math.min(
                        priceRange.max,
                        Math.max(value, minPrice)
                      );
                      setMaxPrice(next);
                    }}
                    className="mt-1 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-800 outline-none focus:border-neutral-400 focus:bg-white"
                  />
                </label>
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                Rango disponible: {formatPrice(priceRange.min)} -{" "}
                {formatPrice(priceRange.max)}
              </p>
            </div>

            <div className="space-y-2 text-sm text-neutral-700">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-neutral-50">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 text-[#840c4a] focus:ring-[#840c4a]"
                  checked={onlyDiscounted}
                  onChange={() => setOnlyDiscounted((prev) => !prev)}
                />
                <span>Solo con descuento</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-neutral-50">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 text-[#840c4a] focus:ring-[#840c4a]"
                  checked={onlyAvailable}
                  onChange={() => setOnlyAvailable((prev) => !prev)}
                />
                <span>Solo productos disponibles</span>
              </label>
            </div>
          </aside>

          <main>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-neutral-900">
                  Productos
                </h2>
                <p className="text-sm text-neutral-500">
                  {totalItems} resultado{totalItems === 1 ? "" : "s"}{" "}
                  encontrados
                </p>
              </div>
              <div className="rounded-full bg-white px-4 py-2 text-sm text-neutral-600 shadow-sm ring-1 ring-neutral-200/60">
                Rango actual: {formatPrice(minPrice)} - {formatPrice(maxPrice)}
              </div>
            </div>

            {totalItems === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl bg-white py-16 shadow-inner">
                <div className="text-3xl">🛋️</div>
                <h3 className="mt-4 text-xl font-semibold text-neutral-800">
                  No encontramos resultados
                </h3>
                <p className="mt-2 max-w-md text-center text-sm text-neutral-500">
                  Probá con otros filtros o restablecé la búsqueda para ver todo
                  nuestro catálogo.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-6 rounded-full bg-[#840c4a] px-6 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Ver todo el catálogo
                </button>
              </div>
            ) : (
              <div
                className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                data-test="catalog-product-grid"
              >
                {filteredProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} categories={categories} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
