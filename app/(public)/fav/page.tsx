"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowLeft, Heart } from "lucide-react";
import { useFavStore } from "@/lib/store/favStore";
import { useCartStore } from "@/lib/store/cartStore";
import { calculatePrice } from "@/lib/calculatePrice";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";

const FavPage = () => {

    const { items, toggle } = useFavStore();
    const addToCart = useCartStore((s) => s.addItem);
    const { user } = useAuth();

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#f0f4f8]">
                <Heart className="w-20 h-20 text-sky-200" />
                <h2 className="text-2xl font-bold text-sky-900">No favorites yet</h2>
                <p className="text-gray-400 text-sm">Save items you love and find them here.</p>
                <Link
                    href="/"
                    className="flex items-center gap-2 bg-sky-700 hover:bg-sky-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f0f4f8] px-4 py-10 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="flex items-center gap-2 text-sky-600 hover:text-sky-800 text-sm font-medium mb-4 transition-colors w-fit">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Shopping
                    </Link>
                    <h1 className="text-4xl font-black text-sky-900 tracking-tight">Your Favorites</h1>
                    <p className="text-gray-400 mt-1 max-w-md text-sm">
                        A curated selection of your most-loved pieces. Review your choices and bring them home.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {items.map((item) => {
                        const finalPrice = calculatePrice(item) ?? parseFloat(item.price as string);
                        const original = parseFloat(item.price as string);
                        const hasDiscount = calculatePrice(item) !== null;

                        return (
                            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col group">
                                {/* Image */}
                                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <button
                                        onClick={() => {
                                            toggle(item, user!.id);
                                            toast.success("Removed from favorites");
                                        }}
                                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-white transition-all shadow-sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Info */}
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="font-bold text-sky-900 text-sm leading-tight line-clamp-1">{item.name}</h3>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="font-black text-sky-700">${finalPrice.toFixed(2)}</span>
                                        {hasDiscount && (
                                            <span className="text-xs text-gray-400 line-through">${original.toFixed(2)}</span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => {
                                            addToCart(item, user!.id);
                                            toggle(item, user!.id);
                                            toast.success(`${item.name} moved to cart!`);
                                        }}
                                        className="mt-3 w-full bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                                    >
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                        Move to Cart
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FavPage;