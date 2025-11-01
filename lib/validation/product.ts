import { z } from "zod";

export const ProductStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const productBodySchema = z.object({
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
  categoryIds: z.array(z.string().min(1)).default([]),
});

export type ProductPayload = z.infer<typeof productBodySchema>;

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
