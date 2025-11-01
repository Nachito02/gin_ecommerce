"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { AiOutlineShoppingCart } from "react-icons/ai";
import useCarritoStore from "@/hooks/useCarritoStore";
import { Product } from "@/models/Product";

export default function BuyBoxClient({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCarritoStore((s) => s.addItem);

  return (
    <div className="rounded-2xl bg-white mt-5 shadow-sm ring-1 ring-neutral-200/60 p-4">
      <div className="space-y-3">
        <div className="text-sm text-neutral-700">
          <span className="text-emerald-600 font-medium">Llega gratis</span> a tu domicilio
          <div className="text-neutral-500">Entre 2 y 5 días hábiles</div>
        </div>

        <div className="text-sm text-neutral-700">
          <span className="font-medium">Devolución gratis</span> dentro de 30 días
        </div>

        <div className="pt-2 space-y-2">
          <Button label="Comprar ahora" onClick={() => router.push("/checkout")} />
          <Button label="Agregar al carrito" onClick={() => addItem(product)} icon={AiOutlineShoppingCart} />
          
        </div>
      </div>
    </div>
  );
}
