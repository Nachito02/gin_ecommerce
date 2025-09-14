// actions/getProducts.ts
import "server-only";
import { prisma } from "@/lib/prismadb";
import type { Product } from "@/models/Product";

export async function getProducts(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      include: {
        // si usás tabla pivote ProductCategory, incluí la categoría real:
        categories: {
          include: { category: true }, // ajustá al nombre real de tu modelo
        },
      },
    });

    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      price: r.price,
      stock: r.stock,
      discountPercentage: r.discountPercentage ?? undefined,
      description: r.description ?? undefined,
      materials: r.materials,
      styleTags: r.styleTags,
      roomTags: r.roomTags,
      widthCm: r.widthCm ?? undefined,
      depthCm: r.depthCm ?? undefined,
      heightCm: r.heightCm ?? undefined,
      weightKg: r.weightKg ?? undefined,
      status: r.status,
      featured: r.featured,
      publishedAt: r.publishedAt ? r.publishedAt.toISOString() : undefined,
      images: r.images,
      // si tu include anterior es { categories: { include: { category: true } } }
      categories: r.categories?.map((c) => ({
        id: c.category.id,
        name: c.category.name,
        slug: c.category.slug,
      })),
      variants: [], // mapeá si los tenés
      reviews: [],  // mapeá si los tenés
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  } catch (e) {
    console.error(e);
    return []; // <- nunca null
  }
}
