import { notFound } from "next/navigation";
import ProductForm from "@/components/forms/ProductForm";
import { prisma } from "@/lib/prismadb";
import { getCategories } from "@/app/actions/getCategories";

type PageProps = {
  params: { id: string };
};

export default async function Page({ params }: PageProps) {
  const [product, categoriesResult] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: {
        categories: {
          include: { category: true },
        },
        variants: true,
      },
    }),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  const productData = JSON.parse(JSON.stringify(product));
  const categories = categoriesResult?.categories ?? [];

  return (
    <div className="px-6 py-8">
      <ProductForm
        mode="edit"
        categories={categories}
        initialProduct={productData}
      />
    </div>
  );
}
