export interface Product {
  id: string;               // ObjectId en Mongo, Prisma lo mapea a string
  title: string;
  slug: string;
  price: number;
  stock: number;
  description?: string;
  materials: string[];
  styleTags: string[];
  roomTags: string[];
  widthCm?: number;
  depthCm?: number;
  heightCm?: number;
  weightKg?: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  featured: boolean;
  publishedAt?: string;
  images: string[]; // la primera es la principal
  // relaciones (simplificadas)
  categories?: { id: string; name: string; slug: string }[];
  variants?: ProductVariant[];
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
  discountPercentage?: number;
}

// Opcional: variantes
export interface ProductVariant {
  id: string;
  productId: string;
  color?: string;
  finish?: string;
  sizeLabel?: string;
  material?: string;
  priceCents: number;
  compareAtPriceCents?: number;
  inStock: number;
  lowStockThreshold?: number;
  widthCm?: number;
  depthCm?: number;
  heightCm?: number;
  weightKg?: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

// Opcional: reseñas
export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  title?: string;
  comment?: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}
