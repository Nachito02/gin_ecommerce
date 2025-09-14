"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import Button from "../Button";

// ====== Utilidades ======
const inputBase =
  "w-full h-11 px-3 rounded-xl bg-white text-neutral-900 ring-1 ring-black/10 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#840c4a] transition";
const labelBase = "text-sm font-medium text-neutral-800";
const hintBase = "text-xs text-neutral-500 mt-1";
const errorBase = "text-xs text-red-600 mt-1";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

interface ProductFormInterface {
  categories: any;
}

const ProductForm: React.FC<ProductFormInterface> = ({ categories }) => {
  const [submitting, setSubmitting] = useState(false);

  const ProductStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

  const schema = z.object({
    title: z.string().min(3, "Mínimo 3 caracteres"),
    slug: z.string().min(3, "El slug es requerido (se genera desde el título)"),
    price: z.coerce.number().positive().optional(),
    description: z.string().optional(),
    stock: z.coerce.number().positive(),
    materials: z.array(z.string().min(1)).default([]),
    styleTags: z.array(z.string().min(1)).default([]),
    roomTags: z.array(z.string().min(1)).default([]),
    widthCm: z.coerce.number().positive().optional(),
    depthCm: z.coerce.number().positive().optional(),
    heightCm: z.coerce.number().positive().optional(),
    weightKg: z.coerce.number().positive().optional(),
    status: ProductStatusEnum.default("DRAFT"),
    featured: z.boolean().default(false),
    discountPercentage: z.coerce.number().optional().nullable(),
    // Media: principal + galería → al submit se combinan en images[]
    mainImage : z.url("Subí una imagen principal"),
    gallery: z.url().array().max(8, "Máximo 8 imágenes").default([]),
    // Categorías relacionadas (IDs)
    categoryIds: z.array(z.string().min(1)).default([]),
  });

  // Types aligned with Zod v4 resolver generics
  type FormInput = z.input<typeof schema>;
  type FormOutput = z.output<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm<FormInput>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      stock: undefined,
      price: undefined,
      materials: [],
      styleTags: [],
      roomTags: [],
      widthCm: undefined,
      depthCm: undefined,
      heightCm: undefined,
      weightKg: undefined,
      status: "DRAFT",
      featured: false,
      mainImage: "",
      gallery: [],
      categoryIds: [],
      discountPercentage: undefined,
    },
  });

  // watchers
  const title = watch("title");
  const slug = watch("slug");
  const mainImage = watch("mainImage");
  const gallery = watch("gallery");
  const priceValue = watch("price" as any); // si querés mostrar preview de precio, añadilo al schema si lo usás

  // auto slug al escribir título (pero editable)
  useMemo(() => {
    if (!title) return;
    if (!slug)
      setValue("slug", slugify(title), {
        shouldDirty: true,
        shouldValidate: true,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const pricePreview = useMemo(() => {
    if (!priceValue || Number.isNaN(priceValue)) return "";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(priceValue);
  }, [priceValue]);

  // helpers de tags (RHF-friendly)
  const setTags =
    (field: "materials" | "styleTags" | "roomTags") => (next: string[]) =>
      setValue(field, next, { shouldDirty: true, shouldValidate: true });

  const selectedCats = watch("categoryIds") ?? [];

  const onSubmit = async (raw: FormOutput) => {
    setSubmitting(true);
    try {
      // Combinar imágenes: principal primero
      const images = [raw.mainImage, ...(raw.gallery || [])];

      // payload final alineado a Prisma Product
      const payload = {
        title: raw.title,
        slug: raw.slug,
        price: raw.price,
        description: raw.description || null,
        stock: raw.stock,
        materials: raw.materials,
        styleTags: raw.styleTags,
        roomTags: raw.roomTags,
        widthCm: raw.widthCm ?? null,
        depthCm: raw.depthCm ?? null,
        heightCm: raw.heightCm ?? null,
        weightKg: raw.weightKg ?? null,
        status: raw.status,
        featured: raw.featured,
        images, // <- principal va primero
        categoryIds: raw.categoryIds, // <- relación: conéctalas en tu handler
        discountPercentage: raw.discountPercentage,
      };

      const response = await axios.post("api/products", payload);

      reset();
      alert("Producto creado ✅");
    } catch (e: any) {
      console.log(e);
      alert(e?.message ?? "Ocurrió un error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="max-w-4xl mx-auto p-6 md:p-8 rounded-2xl shadow-sm ring-1 ring-black/10 bg-[#e7dccd]">
      {/* Heading */}
      <div className="mb-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/70 ring-1 ring-black/5 px-3 py-1 text-xs text-neutral-700">
          <span className="inline-block h-2 w-2 rounded-full bg-[#840c4a]" />
          Nuevo producto
        </span>
        <h2 className="mt-3 text-2xl md:text-3xl font-bold text-neutral-900">
          Crear producto
        </h2>
        <p className="text-sm text-neutral-600">
          Alineado a tu schema de Prisma (Product).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Columna izquierda */}
        <div className="md:col-span-2 space-y-4">
          {/* Título / Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelBase} htmlFor="title">
                Nombre
              </label>
              <input
                id="title"
                className={inputBase}
                placeholder="Ej: Silla Nórdica Roble"
                {...register("title")}
              />
              {errors.title && (
                <p className={errorBase}>{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className={labelBase} htmlFor="slug">
                Slug
              </label>
              <input
                id="slug"
                className={inputBase}
                placeholder="silla-nordica-roble"
                {...register("slug")}
                onBlur={(e) =>
                  setValue("slug", slugify(e.target.value), {
                    shouldValidate: true,
                  })
                }
              />
              {errors.slug && (
                <p className={errorBase}>{errors.slug.message}</p>
              )}
            </div>
          </div>

          {/* Price}  */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 space-y-4">
              <label className={labelBase} htmlFor="price">
                Precio
              </label>
              <input
                id="price"
                className={inputBase}
                placeholder="100"
                {...register("price")}
                type="number"
              />
              {errors.price && (
                <p className={errorBase}>{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className={labelBase} htmlFor="discountPercentage">
                Descuento
              </label>
              <input
                id="discountPercentage"
                className={inputBase}
                placeholder="10"
                {...register("discountPercentage")}
                type="number"
              />
              {errors.discountPercentage && (
                <p className={errorBase}>{errors.discountPercentage.message}</p>
              )}
            </div>

            <div>
              <label className={labelBase} htmlFor="stock">
                Stock
              </label>
              <input
                id="stock"
                className={inputBase}
                placeholder="10"
                {...register("stock")}
                type="number"
              />
              {errors.stock && (
                <p className={errorBase}>{errors.stock.message}</p>
              )}
            </div>
          </div>

          {/* Imagen principal */}
          <div>
            <label className={labelBase}>Imagen principal</label>
            <div className="mt-1">
              <CldUploadWidget
                uploadPreset={"qqeo7owm"}
                options={{
                  multiple: false,
                  maxFiles: 1,
                  sources: ["local", "camera", "url"],
                }}
                onSuccess={(result, { widget }) => {
                  const url = (result?.info as any)?.secure_url as string;
                  if (url)
                    setValue("mainImage", url, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  widget.close();
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open?.()}
                    className="h-11 px-4 rounded-xl bg-white/80 text-neutral-800 ring-1 ring-black/10 hover:bg-white transition"
                  >
                    Subir imagen principal
                  </button>
                )}
              </CldUploadWidget>
            </div>
            {errors.mainImage && (
              <p className={errorBase}>{errors.mainImage.message}</p>
            )}
            {mainImage && (
              <div className="mt-3 rounded-xl overflow-hidden ring-1 ring-black/10 bg-white/60">
                <div className="relative w-full max-h-[360px] aspect-[4/3]">
                  <CldImage
                    src={mainImage}
                    alt="Main"
                    fill
                    className="object-contain"
                    crop="fit"
                    quality="auto"
                    format="auto"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className={labelBase} htmlFor="description">
              Descripción
            </label>
            <textarea
              id="description"
              className={`${inputBase} h-28 resize-y`}
              placeholder="Características, materiales, medidas…"
              {...register("description")}
            />
            {errors.description && (
              <p className={errorBase}>{errors.description.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelBase}>Materiales</label>
              <TagInput
                values={watch("materials") ?? []}
                onChange={setTags("materials")}
                placeholder="Ej: madera maciza"
              />
              {errors.materials && (
                <p className={errorBase}>Agregá al menos un material</p>
              )}
            </div>
            <div>
              <label className={labelBase}>Estilos</label>
              <TagInput
                values={watch("styleTags") ?? []}
                onChange={setTags("styleTags")}
                placeholder="Ej: nórdico"
              />
              {errors.styleTags && (
                <p className={errorBase}>Agregá al menos un estilo</p>
              )}
            </div>
            <div>
              <label className={labelBase}>Ambientes</label>
              <TagInput
                values={watch("roomTags") ?? []}
                onChange={setTags("roomTags")}
                placeholder="Ej: comedor"
              />
              {errors.roomTags && (
                <p className={errorBase}>Agregá al menos un ambiente</p>
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-4">
          {/* Medidas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelBase} htmlFor="widthCm">
                Ancho (cm)
              </label>
              <input
                id="widthCm"
                type="number"
                step="0.1"
                min="0"
                className={inputBase}
                {...register("widthCm")}
              />
            </div>
            <div>
              <label className={labelBase} htmlFor="depthCm">
                Profundidad (cm)
              </label>
              <input
                id="depthCm"
                type="number"
                step="0.1"
                min="0"
                className={inputBase}
                {...register("depthCm")}
              />
            </div>
            <div>
              <label className={labelBase} htmlFor="heightCm">
                Alto (cm)
              </label>
              <input
                id="heightCm"
                type="number"
                step="0.1"
                min="0"
                className={inputBase}
                {...register("heightCm")}
              />
            </div>
            <div>
              <label className={labelBase} htmlFor="weightKg">
                Peso (kg)
              </label>
              <input
                id="weightKg"
                type="number"
                step="0.1"
                min="0"
                className={inputBase}
                {...register("weightKg")}
              />
            </div>
          </div>

          {/* Estado */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelBase} htmlFor="status">
                Estado
              </label>
              <select id="status" className={inputBase} {...register("status")}>
                <option value="DRAFT">Borrador</option>
                <option value="PUBLISHED">Publicado</option>
                <option value="ARCHIVED">Archivado</option>
              </select>
              {errors.status && (
                <p className={errorBase}>{errors.status.message}</p>
              )}
            </div>

            <div className="flex items-center gap-3 mt-6">
              <input
                id="featured"
                type="checkbox"
                className="h-4 w-4"
                {...register("featured")}
              />
              <label htmlFor="featured" className="text-sm text-neutral-800">
                Destacado
              </label>
            </div>
          </div>

          {/* Categorías (multi) */}
          <div>
            <label className={labelBase}>Categorías</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c: any) => {
                const checked = selectedCats.includes(c.id);
                return (
                  <label
                    key={c.id}
                    className="inline-flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const next = checked
                          ? selectedCats.filter((x: string) => x !== c.id)
                          : [...selectedCats, c.id];
                        setValue("categoryIds", next, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                    />
                    {c.name}
                  </label>
                );
              })}
            </div>
            {errors.categoryIds && (
              <p className={errorBase}>Seleccioná al menos una categoría</p>
            )}
          </div>

          {/* Galería */}
          <div>
            <label className={labelBase}>Imágenes del carrusel (hasta 8)</label>
            <div className="mt-1">
              <CldUploadWidget
                uploadPreset={"qqeo7owm"}
                options={{
                  multiple: true,
                  maxFiles: Math.max(0, 8 - (gallery?.length ?? 0)),
                  sources: ["local", "camera", "url"],
                }}
                onSuccess={(result) => {
                  const url = (result?.info as any)?.secure_url as string;
                  if (!url) return;
                  const current = getValues("gallery") ?? [];
                  const next = [...current, url].slice(0, 8);
                  setValue("gallery", next, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open?.()}
                    className="h-11 px-4 rounded-xl bg-white/80 text-neutral-800 ring-1 ring-black/10 hover:bg-white transition"
                  >
                    Subir imágenes
                  </button>
                )}
              </CldUploadWidget>
            </div>
            {errors.gallery && (
              <p className={errorBase}>{errors.gallery.message as string}</p>
            )}

            <div className="mt-3 grid grid-cols-3 gap-2">
              {gallery?.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative rounded-lg overflow-hidden ring-1 ring-black/10 bg-white/60"
                >
                  <CldImage
                    src={url}
                    alt={`img-${idx}`}
                    width={320}
                    height={220}
                    crop="fill"
                    gravity="auto"
                    className="w-full h-28 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = gallery.filter((_, i) => i !== idx);
                      setValue("gallery", next, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                    className="absolute top-1 right-1 h-7 px-2 rounded-md bg-white/90 text-xs text-neutral-800 hover:bg-white"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button
          label={submitting ? "Creando..." : "Crear producto"}
          onClick={handleSubmit(onSubmit as any)}
          outline={false}
          small={false}
          disabled={!isValid || submitting}
        />
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex justify-center items-center h-11 px-5 rounded-xl bg-white/80 text-neutral-800 ring-1 ring-black/10 hover:bg-white transition"
        >
          Limpiar
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

// ====== TagInput simple ======
function TagInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [buf, setBuf] = useState("");
  const commit = () => {
    const v = buf.trim();
    if (!v) return;
    if (!values.includes(v)) onChange([...values, v]);
    setBuf("");
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/70 ring-1 ring-black/10 text-xs text-neutral-700"
          >
            {t}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== t))}
              className="text-neutral-500 hover:text-neutral-800"
              aria-label={`Quitar ${t}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={buf}
          onChange={(e) => setBuf(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            }
          }}
          className={inputBase}
          placeholder={placeholder || "Escribí y presioná Enter"}
        />
        <button
          type="button"
          onClick={commit}
          className="h-11 px-4 rounded-xl bg-white/80 text-neutral-800 ring-1 ring-black/10 hover:bg-white transition"
        >
          Agregar
        </button>
      </div>
    </div>
  );
}
