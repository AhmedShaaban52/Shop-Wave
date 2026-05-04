import { create } from "zustand";
import { ProductWithCategory } from "@/utils/ProductsFields";
import {
  fetchCartAction,
  addToCartAction,
  removeFromCartAction,
  updateCartQuantityAction,
  clearCartAction,
} from "@/lib/actions/cartActions";

interface CartItem extends ProductWithCategory {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  loading: boolean;
  fetchCart: (userId: string) => Promise<void>;
  addItem: (product: ProductWithCategory, userId: string) => Promise<void>;
  removeItem: (productId: string, userId: string) => Promise<void>;
  updateQuantity: (
    productId: string,
    quantity: number,
    userId: string,
  ) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async (userId) => {
    set({ loading: true });
    const result = await fetchCartAction(userId);
    if (result.success && result.data) {
      const items = result.data.map((row: any) => ({
        ...row.products,
        quantity: row.quantity,
      }));
      set({ items, loading: false });
    } else {
      set({ loading: false });
    }
  },

  addItem: async (product, userId) => {
    const existing = get().items.find((i) => i.id === product.id);
    const result = await addToCartAction(
      userId,
      product.id,
      existing?.quantity,
    );
    if (result.success) {
      if (existing) {
        set({
          items: get().items.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        });
      } else {
        set({ items: [...get().items, { ...product, quantity: 1 }] });
      }
    }
  },

  removeItem: async (productId, userId) => {
    const result = await removeFromCartAction(userId, productId);
    if (result.success) {
      set({ items: get().items.filter((i) => i.id !== productId) });
    }
  },

  updateQuantity: async (productId, quantity, userId) => {
    if (quantity <= 0) {
      await get().removeItem(productId, userId);
      return;
    }
    const result = await updateCartQuantityAction(userId, productId, quantity);
    if (result.success) {
      set({
        items: get().items.map((i) =>
          i.id === productId ? { ...i, quantity } : i,
        ),
      });
    }
  },

  clearCart: async (userId) => {
    const result = await clearCartAction(userId);
    if (result.success) {
      set({ items: [] });
    }
  },
}));
