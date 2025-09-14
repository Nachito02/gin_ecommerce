// app/actions/getSimilarProducts.ts
import "server-only";
import { prisma } from "@/lib/prismadb";
import { Product } from "@/models/Product";

export async function getSimilarProducts(
  productId: string,
  categorySlugs: string[],
  limit = 8
): Promise<Product[]> {
  if (!categorySlugs.length) return [];

  try {
    const rows = await prisma.product.findMany({
      where: {
        id: { not: productId }, // excluye el producto actual
        categories: {
          some: {
            category: {
              slug: { in: categorySlugs }, // comparte al menos 1 categoría
            },
          },
        },
      },
      include: {
        categories: { include: { category: true } },
      },
      take: limit,
    });

    return rows.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: p.price,
      stock: p.stock,
      description: p.description ?? undefined,
      images: p.images,
      materials: p.materials,
      styleTags: p.styleTags,
      roomTags: p.roomTags,
      status: p.status,
      featured: p.featured,
      publishedAt: p.publishedAt ? p.publishedAt.toISOString() : undefined,
      categories: p.categories.map((pc) => ({
        id: pc.category.id,
        name: pc.category.name,
        slug: pc.category.slug,
      })),
      variants: [], // podés mapear si los traés
      reviews: [],  // idem arriba
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  } catch (err) {
    console.error("getSimilarProducts error:", err);
    return [];
  }
}
