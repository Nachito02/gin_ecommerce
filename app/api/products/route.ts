import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import {
  productBodySchema,
  slugify,
} from "@/lib/validation/product";

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
    const parsed = productBodySchema.safeParse(json);
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
