import { create } from "zustand";
import { ProductWithCategory } from "@/utils/ProductsFields";
import {
  fetchFavsAction,
  addToFavAction,
  removeFromFavAction,
} from "@/lib/actions/favActions";

interface FavStore {
  items: ProductWithCategory[];
  loading: boolean;
  fetchFavs: (userId: string) => Promise<void>;
  toggle: (product: ProductWithCategory, userId: string) => Promise<void>;
  isFav: (id: string) => boolean;
}

export const useFavStore = create<FavStore>((set, get) => ({
  items: [],
  loading: false,

  fetchFavs: async (userId) => {
    set({ loading: true });
    const result = await fetchFavsAction(userId);
    if (result.success && result.data) {
      const items = result.data.map((row: any) => row.products);
      set({ items, loading: false });
    } else {
      set({ loading: false });
    }
  },

  toggle: async (product, userId) => {
    const isFav = get().isFav(product.id);
    if (isFav) {
      const result = await removeFromFavAction(userId, product.id);
      if (result.success) {
        set({ items: get().items.filter((i) => i.id !== product.id) });
      }
    } else {
      const result = await addToFavAction(userId, product.id);
      if (result.success) {
        set({ items: [...get().items, product] });
      }
    }
  },

  isFav: (id) => get().items.some((i) => i.id === id),
}));
