"use client";

import { Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { ProductWithCategory } from "@/utils/ProductsFields";
import { toast } from "sonner";

interface ProductCartProps {
    product: ProductWithCategory;
    userId: string;
    quantity: number;
    variant: "default" | "compact";
}

export const ProductCart = ({ product, userId, quantity, variant = "default" }: ProductCartProps) => {
    const { updateQuantity, removeItem } = useCartStore();

    const handleIncrease = () => updateQuantity(product.id, quantity + 1, userId);
    const handleDecrease = () => {
        if (quantity === 1) {
            removeItem(product.id, userId);
            toast.info("Removed from cart");
        } else {
            updateQuantity(product.id, quantity - 1, userId);
        }
    };

    if (variant === "compact") {
        return (
            <div className="flex items-center gap-2">
                <button
                    onClick={handleDecrease}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-sky-100 hover:text-sky-700 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                >
                    <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center font-bold text-gray-800">{quantity}</span>
                <button
                    onClick={handleIncrease}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-sky-100 hover:text-sky-700 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                >
                    <Plus className="w-3 h-3" />
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between w-full gap-2">
            <button
                onClick={handleDecrease}
                className="w-12 h-12 rounded-full bg-[#00628c] text-white flex items-center justify-center hover:bg-[#00557b] transition-all active:scale-90 shadow-sm cursor-pointer"
            >
                {quantity === 1 ? <Trash2 className="w-5 h-5" /> : <Minus className="w-5 h-5" />}
            </button>
            <div className="flex-1 h-12 flex items-center justify-center border-2 border-[#00628c] rounded-full bg-white">
                <span className="text-xl font-bold text-[#00628c]">{quantity}</span>
            </div>
            <button
                onClick={handleIncrease}
                className="w-12 h-12 rounded-full bg-[#00628c] text-white flex items-center justify-center hover:bg-[#00557b] transition-all active:scale-90 shadow-sm cursor-pointer"
            >
                <Plus className="w-5 h-5" />
            </button>
        </div>
    );
};