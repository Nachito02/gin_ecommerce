import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import {
  productBodySchema,
  slugify,
  ProductPayload,
} from "@/lib/validation/product";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function ensureUniqueSlugForUpdate(
  base: string,
  productId: string
): Promise<string> {
  let candidate = base;
  let n = 2;

  while (true) {
    const existing = await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === productId) {
      return candidate;
    }

    candidate = `${base}-${n++}`;
  }
}

async function upsertProductCategories(
  productId: string,
  categoryIds: ProductPayload["categoryIds"]
) {
  await prisma.productCategory.deleteMany({
    where: { productId },
  });

  if (!categoryIds.length) {
    return;
  }

  await prisma.productCategory.createMany({
    data: categoryIds.map((categoryId) => ({
      productId,
      categoryId,
    })),
  });
}

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (err) {
    console.error("GET /api/products/[id] error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const params = await context.params;
    const id = params?.id;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

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

    const payload = parsed.data;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { id: true, publishedAt: true },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (payload.categoryIds.length) {
      const categories = await prisma.category.findMany({
        where: { id: { in: payload.categoryIds } },
        select: { id: true },
      });
      const categorySet = new Set(categories.map((c) => c.id));
      const missing = payload.categoryIds.filter((id) => !categorySet.has(id));
      if (missing.length) {
        return NextResponse.json(
          { error: "Categorías inexistentes", missing },
          { status: 400 }
        );
      }
    }

    const normalizedSlug = slugify(payload.slug);
    const uniqueSlug = await ensureUniqueSlugForUpdate(
      normalizedSlug,
      id
    );

    const updated = await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          discountPercentage: payload.discountPercentage ?? 0,
          title: payload.title,
          slug: uniqueSlug,
          description: payload.description ?? null,
          stock: payload.stock,
          materials: payload.materials,
          styleTags: payload.styleTags,
          roomTags: payload.roomTags,
          price: payload.price,
          widthCm: payload.widthCm ?? null,
          depthCm: payload.depthCm ?? null,
          heightCm: payload.heightCm ?? null,
          weightKg: payload.weightKg ?? null,
          status: payload.status,
          featured: payload.featured,
          images: payload.images,
          publishedAt:
            payload.status === "PUBLISHED"
              ? existingProduct.publishedAt ?? new Date()
              : existingProduct.publishedAt,
        },
      });

      await upsertProductCategories(id, payload.categoryIds);

      return tx.product.findUnique({
        where: { id },
        include: {
          categories: {
            include: { category: true },
          },
          variants: true,
        },
      });
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err: any) {
    if (err?.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    console.error("PUT /api/products/[id] error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
