"use client";

import Link from "next/link";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import useCartStore from "@/hooks/useCarritoStore"; // o "@/stores/useCartStore"
import { Product } from "@/models/Product";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}


type ProductWithQuantity = Product & { quantity: number };

type Props = {
  open: boolean;
  onClose: () => void;
  anchorRight?: boolean; // para alinear a derecha (default)
};

export default function CartDropdown({ open, onClose, anchorRight = true }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const items = useCartStore((s) => s.items ?? []);
  const addItem = useCartStore((s) => s.addItem ?? ((p: any) => {}));
  const removeOne = useCartStore((s) => s.removeOne ?? ((id: number) => {}));
  const removeItem = useCartStore((s) => s.removeItem ?? ((id: number) => {}));
  const clearCart = useCartStore((s) => s.clearCart ?? (() => {}));

  const total = items.reduce((sum: number, it: any) => sum + (it.price ?? 0) * (it.quantity ?? 1), 0);

  // cerrar al click afuera / ESC
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={`absolute top-full mt-2 w-[360px] max-h-[70vh] overflow-auto rounded-2xl bg-white text-neutral-900 shadow-lg ring-1 ring-neutral-200/60 z-50 ${
        anchorRight ? "right-0" : "left-0"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200/70">
        <h3 className="font-semibold text-sm">Tu carrito</h3>
        <button  className="p-1 rounded hover:bg-neutral-100" aria-label="Cerrar carrito">
          <X onClick={onClose} size={18} />
        </button>
      </div>

      {/* Lista de items */}
      <ul className="divide-y divide-neutral-200/60">
        {items.length === 0 ? (
          <li className="px-4 py-6 text-sm text-neutral-500">El carrito está vacío</li>
        ) : (
          items.map((it: ProductWithQuantity) => (
            <li key={it.id} className="px-4 py-3 flex items-center gap-3">
              <img
                src={it.images?.[0] ?? "/images/placeholder.jpg"}
                alt={it.title}
                className="w-14 h-14 rounded-lg object-cover bg-neutral-100 ring-1 ring-neutral-200/60"
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{it.title}</div>
                <div className="text-xs text-neutral-500 truncate">
                  {it.categories?.map((c) => c.name).join(", ")}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  {/* Controles cantidad */}
                  <div className="inline-flex items-center rounded-lg ring-1 ring-neutral-300 overflow-hidden">
                    <button
                      className="h-8 w-8 grid place-items-center hover:bg-neutral-100"
                      onClick={() => removeOne(it.id)}
                      aria-label="Disminuir cantidad"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium select-none">{it.quantity ?? 1}</span>
                    <button
                      className="h-8 w-8 grid place-items-center hover:bg-neutral-100"
                      onClick={() => addItem(it, 1)}
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* precio por unidad y subtotal */}
                  <div className="ml-auto text-right">
                    <div className="text-xs text-neutral-500">{formatCurrency(it.price ?? 0)} c/u</div>
                    <div className="text-sm font-semibold">{formatCurrency((it.price ?? 0) * (it.quantity ?? 1))}</div>
                  </div>
                </div>
              </div>

              {/* remove */}
              <button
                className="p-2 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => removeItem(it.id)}
                aria-label="Quitar producto"
                title="Quitar producto"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-neutral-200/70">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Total</span>
          <span className="font-semibold">{formatCurrency(total)}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <Link
            href="/carrito"
            className="flex-1 h-10 inline-flex items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 ring-1 ring-neutral-300 hover:bg-white"
            onClick={onClose}
          >
            Ver carrito
          </Link>
          <Link
            href="/checkout"
            className="flex-1 h-10 inline-flex items-center justify-center rounded-xl bg-[#840c4a] text-white hover:opacity-90"
            onClick={onClose}
          >
            Comprar
          </Link>
        </div>
        <button
          onClick={() => {
            clearCart();
            onClose();
          }}
          className="w-full mt-2 text-xs text-neutral-500 hover:text-neutral-700"
        >
          Vaciar carrito
        </button>
      </div>
    </div>
  );
}
