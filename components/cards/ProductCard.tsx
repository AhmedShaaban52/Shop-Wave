"use client";

import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { ProductWithCategory } from "@/utils/ProductsFields";
import { useCartStore } from "@/lib/store/cartStore";
import { useFavStore } from "@/lib/store/favStore";
import { calculatePrice } from "@/lib/calculatePrice";
import { toast } from "sonner";

export const ProductCard = ({ product }: { product: ProductWithCategory }) => {
    const addToCart = useCartStore((s) => s.addItem);
    const { toggle, isFav } = useFavStore();
    const fav = isFav(product.id);

    const originalPrice = parseFloat(product.price as string);
    const finalPrice = calculatePrice(product);

    return (
        <article className="group flex flex-col bg-white rounded-[1.5rem] shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />

                <button
                    onClick={() => toggle(product)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95 shadow-md z-10"
                >
                    <Heart className={`w-5 h-5 ${fav ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>
            </div>

            <div className="p-6 flex flex-col flex-grow space-y-3">
                {product.categories?.name && (
                    <span className="text-[11px] font-semibold text-sky-600 uppercase tracking-wider">
                        {product.categories.name}
                    </span>
                )}

                <h3 className="text-lg font-bold text-[#0c314e] tracking-tight leading-snug group-hover:text-[#00628c] transition-colors">
                    {product.name}
                </h3>

                {product.description && (
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{product.description}</p>
                )}

                <div className="mt-auto pt-2 flex items-baseline gap-3">
                    <span className="text-2xl font-black text-[#00628c]">
                        ${finalPrice !== null ? finalPrice.toFixed(2) : originalPrice.toFixed(2)}
                    </span>
                    {finalPrice !== null && (
                        <span className="text-sm text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
                    )}
                </div>

                <button
                    onClick={() => {
                        addToCart(product);
                        toast.success(`${product.name} added to cart!`);
                    }}
                    className="w-full bg-[#00628c] hover:bg-[#00557b] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98]"
                >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Cart</span>
                </button>
            </div>
        </article>
    );
};