import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductWithCategory } from "@/utils/ProductsFields";

interface FavStore {
  items: ProductWithCategory[];
  addItem: (product: ProductWithCategory) => void;
  removeItem: (id: string) => void;
  isFav: (id: string) => boolean;
  toggle: (product: ProductWithCategory) => void;
}

export const useFavStore = create<FavStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => set({ items: [...get().items, product] }),
      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),
      isFav: (id) => get().items.some((i) => i.id === id),
      toggle: (product) => {
        if (get().isFav(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },
    }),
    { name: "fav-storage" },
  ),
);
