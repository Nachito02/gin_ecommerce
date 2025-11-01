import { notFound } from "next/navigation";
import ProductForm from "@/components/forms/ProductForm";
import { prisma } from "@/lib/prismadb";
import { getCategories } from "@/app/actions/getCategories";

type Params = Promise<{ slug: string }>;

export default async function Page(props: { params: Params }) {

  const { slug } = await props.params;


  const [product, categoriesResult] = await Promise.all([
    prisma.product.findUnique({
      where: { id: slug },
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
