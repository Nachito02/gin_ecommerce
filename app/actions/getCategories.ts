import "server-only";
import { prisma } from "@/lib/prismadb";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany();

    return {
      categories,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}
