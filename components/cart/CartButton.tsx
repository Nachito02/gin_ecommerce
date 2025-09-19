"use client";

import { ShoppingCart } from "lucide-react";
import useCartStore from "@/hooks/useCarritoStore"; // o "@/stores/useCartStore" si lo renombraste

type Props = {
  onClick?: () => void;
  className?: string;
  
};

export default function CartButton({ onClick, className }: Props) {
  const total = useCartStore((s) => s.getTotalItems?.() ?? s.items?.reduce((a: number, it: any) => a + (it.quantity ?? 1), 0));

  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center justify-center color-black ${className ?? ""}`}
      aria-label="Abrir carrito"
    >
      <ShoppingCart size={28} />
      {total > 0 && (
        <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#840c4a] text-white text-[11px] leading-[18px] text-center">
          {total}
        </span>
      )}
    </button>
  );
}
