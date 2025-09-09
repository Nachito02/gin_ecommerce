import { Product } from "@/models/Product";
import { create } from "zustand";



type CarritoState = {
  productos: Product[];
  agregarProducto: (producto: Product) => void;
  quitarProducto: (id: number) => void;
  limpiarCarrito: () => void;
};

const useCarritoStore = create<CarritoState>((set) => ({
  productos: [],
  agregarProducto: (producto) =>
    set((state) => ({ productos: [...state.productos, producto] })),
  quitarProducto: (id) =>
    set((state) => ({
      productos: state.productos.filter((p) => p.id !== id),
    })),
  limpiarCarrito: () => set({ productos: [] }),
}));

export default useCarritoStore;
