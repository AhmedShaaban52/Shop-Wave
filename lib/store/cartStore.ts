import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductWithCategory } from "@/utils/ProductsFields";

interface CartItem extends ProductWithCategory {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: ProductWithCategory) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const existing = get().items.find((i) => i.id === product.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          });
        } else {
          set({ items: [...get().items, { ...product, quantity: 1 }] });
        }
      },
      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },
      clearCart: () => set({ items: [] }),
      total: () => {
        return get().items.reduce((sum, item) => {
          const price = parseFloat(item.price as string);
          return sum + price * item.quantity;
        }, 0);
      },
    }),
    { name: "cart-storage" },
  ),
);
