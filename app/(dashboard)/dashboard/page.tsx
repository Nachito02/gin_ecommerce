import { auth } from "@/auth";

import { prisma } from "@/lib/prismadb";
import { ProductStatus } from "@prisma/client";
import {
  AlertTriangle,
  Archive,
  Boxes,
  ClipboardList,
  DollarSign,
  Hourglass,
  Package,
  PackageCheck,
  Sparkles,
  Star,
  Tag,
  Pencil,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("es-AR", {
  maximumFractionDigits: 0,
});

const LOW_STOCK_THRESHOLD = 5;

const statusLabels: Record<ProductStatus, string> = {
  [ProductStatus.DRAFT]: "Borrador",
  [ProductStatus.PUBLISHED]: "Publicado",
  [ProductStatus.ARCHIVED]: "Archivado",
};

const statusTone: Record<ProductStatus, string> = {
  [ProductStatus.DRAFT]: "bg-amber-100 text-amber-700 ring-amber-200/80",
  [ProductStatus.PUBLISHED]:
    "bg-emerald-100 text-emerald-700 ring-emerald-200/80",
  [ProductStatus.ARCHIVED]:
    "bg-neutral-100 text-neutral-600 ring-neutral-200/80",
};

const statusIconMap: Record<ProductStatus, typeof PackageCheck> = {
  [ProductStatus.DRAFT]: Hourglass,
  [ProductStatus.PUBLISHED]: PackageCheck,
  [ProductStatus.ARCHIVED]: Archive,
};

function formatCurrency(value: number) {
  return currencyFormatter.format(Math.round(value));
}

function formatNumber(value: number) {
  return numberFormatter.format(Math.round(value));
}

type StatCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  helper?: string;
  accentClass?: string;
};

function StatCard({ title, value, icon, helper, accentClass }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200/60">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-neutral-900">
            {value}
          </p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            accentClass ?? "bg-carbon text-white"
          }`}
        >
          {icon}
        </div>
      </div>
      {helper ? (
        <p className="mt-4 text-xs text-neutral-500">{helper}</p>
      ) : null}
    </div>
  );
}

export default async function Page() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }


  const [products, categoriesCount, reviewsSummary] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    }),
    prisma.category.count(),
    prisma.review.aggregate({
      _avg: { rating: true },
      _count: { _all: true },
    }),
  ]);

  const handleDelete = async (id: string) => {
    
   return
  };

  const totalProducts = products.length;
  const publishedProducts = products.filter(
    (product) => product.status === ProductStatus.PUBLISHED
  ).length;
  const draftProducts = products.filter(
    (product) => product.status === ProductStatus.DRAFT
  ).length;
  const archivedProducts = products.filter(
    (product) => product.status === ProductStatus.ARCHIVED
  ).length;
  const featuredProducts = products.filter(
    (product) => product.featured
  ).length;
  const discountedProducts = products.filter(
    (product) => (product.discountPercentage ?? 0) > 0
  );
  const lowStockCandidates = products.filter(
    (product) => (product.stock ?? 0) <= LOW_STOCK_THRESHOLD
  );
  const lowStockHighlights = [...lowStockCandidates]
    .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
    .slice(0, 5);
  const totalUnitsAvailable = products.reduce(
    (acc, product) => acc + (product.stock ?? 0),
    0
  );
  const totalInventoryValue = products.reduce(
    (acc, product) => acc + Number(product.price ?? 0) * (product.stock ?? 0),
    0
  );
  const averageDiscount =
    discountedProducts.length > 0
      ? discountedProducts.reduce(
          (acc, product) => acc + (product.discountPercentage ?? 0),
          0
        ) / discountedProducts.length
      : 0;

  const statusDistribution = [
    {
      key: ProductStatus.PUBLISHED,
      label: "Publicados",
      value: publishedProducts,
      color: "bg-emerald-500",
    },
    {
      key: ProductStatus.DRAFT,
      label: "Borradores",
      value: draftProducts,
      color: "bg-amber-500",
    },
    {
      key: ProductStatus.ARCHIVED,
      label: "Archivados",
      value: archivedProducts,
      color: "bg-neutral-400",
    },
  ];

  const reviewsCount = reviewsSummary._count?._all ?? 0;
  const averageRating = reviewsSummary._avg?.rating ?? null;

  const recentProducts = products.slice(0, 6);

  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-10">
        <section className="rounded-3xl bg-white px-6 py-8 shadow-sm ring-1 ring-neutral-200/60 sm:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-carbon/70">
                Panel general
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-neutral-900 sm:text-4xl">
                Hola, {session.user.name} 👋
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-neutral-500">
                Seguimiento rápido del catálogo, promociones y stock. Revisa los
                productos recientes o actúa sobre las alertas de inventario.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
              <div className="rounded-full bg-neutral-100 px-4 py-2">
                {formatNumber(categoriesCount)} categorías activas
              </div>
              <div className="rounded-full bg-neutral-100 px-4 py-2">
                {featuredProducts} destacados en portada
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Productos totales"
            value={formatNumber(totalProducts)}
            helper={`Publicados ${publishedProducts} · Borradores ${draftProducts}`}
            icon={<Package className="h-6 w-6" />}
            accentClass="bg-carbon text-white"
          />
          <StatCard
            title="Unidades en stock"
            value={`${formatNumber(totalUnitsAvailable)} u.`}
            helper={`${lowStockCandidates.length} productos con stock ≤ ${LOW_STOCK_THRESHOLD}`}
            icon={<Boxes className="h-6 w-6" />}
            accentClass="bg-emerald-500/90 text-white"
          />
          <StatCard
            title="Valor inventario"
            value={formatCurrency(totalInventoryValue)}
            helper={`${featuredProducts} productos destacados disponibles`}
            icon={<DollarSign className="h-6 w-6" />}
            accentClass="bg-carbon/90 text-white"
          />
          <StatCard
            title="Reseñas"
            value={formatNumber(reviewsCount)}
            helper={
              averageRating
                ? `Promedio ${averageRating.toFixed(1)} / 5`
                : "Aún sin reseñas registradas"
            }
            icon={<Star className="h-6 w-6" />}
            accentClass="bg-amber-500 text-white"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/60">
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-neutral-900">
                    Últimos productos cargados
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Ordenados del más reciente al más antiguo
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200/70 text-sm">
                  <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Producto</th>
                      <th className="px-6 py-3 font-semibold">Estado</th>
                      <th className="px-6 py-3 font-semibold">Categorías</th>
                      <th className="px-6 py-3 font-semibold text-right">
                        Stock
                      </th>
                      <th className="px-6 py-3 font-semibold text-right">
                        Precio
                      </th>
                      <th className="px-6 py-3 font-semibold text-right">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 bg-white">
                    {recentProducts.map((product) => {
                      const StatusIcon = statusIconMap[product.status];

                      return (
                        <tr key={product.id} className="hover:bg-neutral-50/80">
                          <td className="px-6 py-4">
                            <div className="font-medium text-neutral-900">
                              {product.title}
                            </div>
                            <div className="text-xs text-neutral-500">
                              Creado el{" "}
                              {new Intl.DateTimeFormat("es-AR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }).format(product.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                                statusTone[product.status]
                              }`}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />
                              {statusLabels[product.status]}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs text-neutral-500">
                              {product.categories.length > 0
                                ? product.categories
                                    .map((catLink) => catLink.category.name)
                                    .join(", ")
                                : "Sin categoría"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="font-medium text-neutral-900">
                              {product.stock ?? 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="font-semibold text-neutral-900">
                              {formatCurrency(Number(product.price ?? 0))}
                            </div>
                            {product.discountPercentage ? (
                              <span className="text-xs text-emerald-600">
                                {product.discountPercentage}% OFF
                              </span>
                            ) : null}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-center items-center gap-2">
                              <Link href={`/dashboard/edit/${product.id}`}>
                                <Pencil
                                  color="#fe9a00"
                                  className="h-5 w-5  cursor-pointer"
                                />
                              </Link>
                              <Trash
                              onClick={ async() => await handleDelete(product.id)}
                                color="red"
                                className="h-5 w-5 cursor-pointer"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {recentProducts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-10 text-center text-sm text-neutral-500"
                        >
                          Todavía no hay productos cargados en la tienda.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200/60">
                <h2 className="text-sm font-semibold text-neutral-900">
                  Estado del catálogo
                </h2>
                <p className="mt-1 text-xs text-neutral-500">
                  Distribución de los productos por estado
                </p>

                <ul className="mt-6 space-y-4">
                  {statusDistribution.map((item) => {
                    const percentage =
                      totalProducts > 0
                        ? Math.round((item.value / totalProducts) * 100)
                        : 0;
                    return (
                      <li key={item.key}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-neutral-700">
                            {item.label}
                          </span>
                          <span className="text-neutral-500">
                            {item.value} · {percentage}%
                          </span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-neutral-200/80">
                          <div
                            className={`h-full rounded-full ${item.color}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200/60">
                <h2 className="text-sm font-semibold text-neutral-900">
                  Promociones activas
                </h2>
                <p className="mt-1 text-xs text-neutral-500">
                  Resumen de descuentos aplicados al catálogo
                </p>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Tag className="h-4 w-4 text-emerald-500" />
                      <span>Productos con descuento</span>
                    </div>
                    <span className="font-medium text-neutral-900">
                      {discountedProducts.length} / {totalProducts}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span>Descuento promedio</span>
                    </div>
                    <span className="font-medium text-neutral-900">
                      {discountedProducts.length > 0
                        ? `${averageDiscount.toFixed(1)}%`
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200/60">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-neutral-900">
                  Alertas de stock
                </h2>
                <span className="text-xs text-neutral-500">
                  ≤ {LOW_STOCK_THRESHOLD} unidades
                </span>
              </div>
              <ul className="mt-5 space-y-4 text-sm">
                {lowStockHighlights.length === 0 ? (
                  <li className="text-neutral-500">
                    No hay alertas. El inventario está saludable.
                  </li>
                ) : (
                  lowStockHighlights.map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-medium text-neutral-900">
                          {product.title}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {product.categories.length > 0
                            ? product.categories
                                .map((catLink) => catLink.category.name)
                                .join(", ")
                            : "Sin categoría"}
                        </p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                        {product.stock ?? 0} u.
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200/60">
              <h2 className="text-sm font-semibold text-neutral-900">
                Próximos pasos sugeridos
              </h2>
              <ul className="mt-5 space-y-3 text-sm text-neutral-600">
                <li className="flex items-start gap-3">
                  <ClipboardList className="mt-0.5 h-4 w-4 text-carbon" />
                  <span>
                    Publica los {draftProducts} productos que siguen en borrador
                    para ampliar el catálogo.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500" />
                  <span>
                    Revisa reposición para {lowStockCandidates.length} productos
                    con stock bajo.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <span>
                    Define campañas para los {discountedProducts.length}{" "}
                    productos con descuento activo.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
