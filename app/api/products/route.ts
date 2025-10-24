import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prismadb";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

const ProductStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

const BodySchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  stock: z.number().positive(),
  materials: z.array(z.string().min(1)).default([]),
  styleTags: z.array(z.string().min(1)).default([]),
  roomTags: z.array(z.string().min(1)).default([]),
  price: z.number().positive(),
  widthCm: z.number().positive().optional().nullable(),
  depthCm: z.number().positive().optional().nullable(),
  heightCm: z.number().positive().optional().nullable(),
  weightKg: z.number().positive().optional().nullable(),
  discountPercentage: z.number().optional().nullable(),
  status: ProductStatusEnum.default("DRAFT"),
  featured: z.boolean().default(false),

  images: z.array(z.string().url()).min(1, "Se requiere al menos una imagen"),

  // Conectamos por IDs (strings de ObjectId). Si preferís slugs, mirá el bloque comentado.
  categoryIds: z.array(z.string().min(1)).default([]),
  // categorySlugs: z.array(z.string().min(1)).default([]), // <- alternativa por slug
});

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

async function ensureUniqueSlug(base: string) {
  let candidate = base;
  let n = 2;
  while (true) {
    const found = await prisma.product.findUnique({
      where: { slug: candidate },
    });
    if (!found) return candidate;
    candidate = `${base}-${n++}`;
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      title,
      slug,
      description,
      stock,
      price,
      materials,
      styleTags,
      roomTags,
      widthCm,
      depthCm,
      heightCm,
      weightKg,
      status,
      featured,
      images,
      categoryIds,
      discountPercentage,

      // categorySlugs,
    } = parsed.data;

    // Normalizar + garantizar slug único
    const normalized = slugify(slug);
    const uniqueSlug = await ensureUniqueSlug(normalized);

    // (Opcional) Validar que las categorías existan para evitar P2018
    if (categoryIds.length) {
      const existing = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true },
      });
      const set = new Set(existing.map((c) => c.id));
      const missing = categoryIds.filter((id) => !set.has(id));
      if (missing.length) {
        return NextResponse.json(
          { error: "Categorías inexistentes", missing },
          { status: 400 }
        );
      }
    }

    // Crear producto + filas en la pivote ProductCategory
    const created = await prisma.product.create({
      data: {
        discountPercentage: discountPercentage ?? 0,
        title,
        slug: uniqueSlug,
        description: description ?? null,
        stock,
        materials,
        styleTags,
        roomTags,
        price,
        widthCm: widthCm ?? null,
        depthCm: depthCm ?? null,
        heightCm: heightCm ?? null,
        weightKg: weightKg ?? null,
        status,
        featured,
        publishedAt: new Date(),
        images, // principal en images[0]

        // 🔗 Relación M-N via pivote:
        ...(categoryIds.length
          ? {
              categories: {
                create: categoryIds.map((id) => ({
                  category: { connect: { id } }, // conecta Category por id
                })),
              },
            }
          : {}),

        // Si querés autor, agrega createdById en el schema y asignalo acá
        // createdById: currentUser.id,
      },
      include: {
        categories: { include: { category: true } },
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/products error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const deleted = await prisma.$transaction(async (tx) => {
      await tx.productCategory.deleteMany({
        where: { productId: id },
      });

      await tx.productVariant.deleteMany({
        where: { productId: id },
      });

      await tx.review.deleteMany({
        where: { productId: id },
      });

      return tx.product.delete({
        where: { id },
      });
    });

    return NextResponse.json(
      { ok: true, id: deleted.id },
      { status: 200 }
    );
  } catch (err: any) {
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    console.error("DELETE /api/products error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
