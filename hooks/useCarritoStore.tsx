import { create } from "zustand";

type Producto = {
  id: number;
  title: string;
  price: string;
  thumbnail?: string;
};

type CarritoState = {
  productos: Producto[];
  agregarProducto: (producto: Producto) => void;
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
