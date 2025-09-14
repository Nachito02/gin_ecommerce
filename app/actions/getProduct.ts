import "server-only";
import { prisma } from "@/lib/prismadb";
import { Product } from "@/models/Product";

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const row = await prisma.product.findUnique({
      where: { slug },
      include: {
        categories: { include: { category: true } },
        // variants: true, reviews: true, // si querés
      },
    });
    if (!row) return null;

    // Si NO tenés price a nivel Product, podés derivarlo de la primer variante:
    // const price = row.variants?.[0] ? row.variants[0].priceCents / 100 : 0;

    const product: Product = {
      id: row.id,
      title: row.title,
      slug: row.slug,
      stock: row.stock,
      price: row.price,
      description: row.description ?? undefined,
      discountPercentage: row.discountPercentage ?? undefined,
      materials: row.materials,
      styleTags: row.styleTags,
      roomTags: row.roomTags,
      widthCm: row.widthCm ?? undefined,
      depthCm: row.depthCm ?? undefined,
      heightCm: row.heightCm ?? undefined,
      weightKg: row.weightKg ?? undefined,
      status: row.status,
      featured: row.featured,
      publishedAt: row.publishedAt ? row.publishedAt.toISOString() : undefined,
      images: row.images,
      categories: row.categories.map((pc) => ({
        id: pc.category.id,
        name: pc.category.name,
        slug: pc.category.slug,
      })),
      variants: [], // mapeá si los traés
      reviews: [],  // mapeá si los traés
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      // price, // <- sólo si agregás a tu interfaz Product
    };

    return product;
  } catch (err) {
    console.error("getProduct error:", err);
    return null;
  }
}
