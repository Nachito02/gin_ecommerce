import React from 'react'
import { getCategories } from "@/app/actions/getCategories";
import ProductForm from "@/components/forms/ProductForm";
 
      
export default async function Page() {
   const categories = await getCategories();
  return (
    <div>
    
       <ProductForm categories={categories?.categories ?? []} />
    </div>
  )
}
