"use client";

import { useState } from "react";
import useCarritoStore from "@/hooks/useCarritoStore";
import { ShoppingCart } from "lucide-react";

export default function CarritoFlotante() {
  const [visible, setVisible] = useState(false);
  const productos = useCarritoStore((state) => state.productos);
  const quitarProducto = useCarritoStore((state) => state.quitarProducto);

  // Función para calcular el total
  const calcularTotal = () => {
    return productos.reduce((total, producto) => {
      const price = parseFloat(producto.price.replace('$', '').replace(',', '')); // Asegúrate de que los precios tengan el formato correcto
      return total + price;
    }, 0);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <div className="flex items-center gap-2 cursor-pointer bg-black text-white px-4 py-2 rounded">
        <ShoppingCart size={20} />
        <span>Carrito ({productos.length})</span>
      </div>

      {visible && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white text-black shadow-lg border rounded z-10 p-4">
          <h3 className="font-bold mb-2">Carrito:</h3>
          <ul className="space-y-2">
            {productos.length > 0 ? (
              productos.map((item) => (
                <li key={item.id} className="flex justify-between items-center text-sm">
                  <span>{item.title}</span>
                  <span>{item.price}</span>
                  <button
                    onClick={() => quitarProducto(item.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Eliminar
                  </button>
                </li>
              ))
            ) : (
              <li className="text-gray-500 text-sm">El carrito está vacío</li>
            )}
          </ul>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>${calcularTotal().toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
