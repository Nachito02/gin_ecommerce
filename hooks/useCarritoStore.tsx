import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/models/Product";

export type CartItem = Product & { quantity: number };

type CartState = {
  items: CartItem[];

  // actions
  addItem: (product: Product, qty?: number) => void;
  removeOne: (id: number) => void;        // decrease quantity by 1
  removeItem: (id: number) => void;       // remove the whole item
  setItemQuantity: (id: number, qty: number) => void;
  clearCart: () => void;

  // selectors (handy for UI)
  getItemQuantity: (id: number) => number;
  getTotalItems: () => number;            // total units, e.g., 7
  getUniqueItems: () => number;           // total unique products, e.g., 3
};

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1) =>
        set((state) => {
          const index = state.items.findIndex((it) => it.id === product.id);
          if (index >= 0) {
            // product already in cart -> increase quantity
            const updated = state.items.map((it, i) =>
              i === index ? { ...it, quantity: it.quantity + qty } : it
            );
            return { items: updated };
          }
          // new product
          return { items: [...state.items, { ...product, quantity: qty }] };
        }),

      removeOne: (id) =>
        set((state) => {
          const item = state.items.find((it) => it.id === id);
          if (!item) return { items: state.items };
          if (item.quantity <= 1) {
            // if quantity becomes 0, remove the item
            return { items: state.items.filter((it) => it.id !== id) };
          }
          // otherwise just decrease quantity
          return {
            items: state.items.map((it) =>
              it.id === id ? { ...it, quantity: it.quantity - 1 } : it
            ),
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((it) => it.id !== id),
        })),

      setItemQuantity: (id, qty) =>
        set((state) => {
          if (qty <= 0) {
            return { items: state.items.filter((it) => it.id !== id) };
          }
          return {
            items: state.items.map((it) =>
              it.id === id ? { ...it, quantity: qty } : it
            ),
          };
        }),

      clearCart: () => set({ items: [] }),

      // selectors
      getItemQuantity: (id) => get().items.find((it) => it.id === id)?.quantity ?? 0,
      getTotalItems: () => get().items.reduce((sum, it) => sum + it.quantity, 0),
      getUniqueItems: () => get().items.length,
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => localStorage),
      // optional: versioning/migrations aquí si lo necesitas
    }
  )
);

export default useCartStore;
