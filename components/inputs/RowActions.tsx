"use client";

import axios from "axios";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RowActions({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    try {
      setPending(true);
      setError(null);
      await axios.delete(`/api/products`, { params: { id } });
      setShowConfirm(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el producto. Intenta nuevamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <Link href={`/dashboard/edit/${id}`}>
          <Pencil color="#fe9a00" className="h-5 w-5 cursor-pointer" />
        </Link>
        <button
          onClick={() => setShowConfirm(true)}
          disabled={pending}
          className="disabled:opacity-50"
          aria-label="Eliminar producto"
        >
          <Trash color="red" className="h-5 w-5 cursor-pointer" />
        </button>
      </div>

      {showConfirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-neutral-900">
              Eliminar producto
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              ¿Seguro que querés eliminar este producto? Esta acción no se puede
              deshacer.
            </p>
            {error ? (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={pending}
                className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={pending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {pending ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
