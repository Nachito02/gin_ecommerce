import ProductForm from "@/components/forms/ProductForm";
import { getCategories } from "../actions/getCategories";

export default async function DashboardPage() {

    const categories = await getCategories()

  return (
   <>
   
    <ProductForm categories={categories?.categories} />
   </>
  );
}
