"use client";

import { useAuth } from "@/context/authContext";
import { useCartStore } from "@/lib/store/cartStore";
import { ProductCart } from "./ProductCart";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export const ProductCartWrapper = ({ product }: { product: any }) => {
    const { user } = useAuth();
    const { addItem, items } = useCartStore();


    const cartItem = items.find((item) => item.id === product.id);
    const quantity = cartItem?.quantity || 0;

    if (!user) {
        return (
            <button
                onClick={() => toast.error("Please login to add items")}
                className="w-full bg-[#00628c] text-white h-16 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg"
            >
                <ShoppingBag className="w-5 h-5" /> LOGIN TO BUY
            </button>
        );
    }

    if (quantity === 0) {
        return (
            <button
                onClick={() => {
                    addItem(product, user.id);
                    toast.success("Added to bag!");
                }}
                className="w-full bg-[#00628c] hover:bg-[#004d6e] text-white h-16 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 active:scale-95 cursor-pointer"
            >
                <ShoppingBag className="w-5 h-5" /> ADD TO BAG
            </button>
        );
    }

    return <ProductCart product={product} userId={user.id} quantity={quantity} variant="default" />;
};