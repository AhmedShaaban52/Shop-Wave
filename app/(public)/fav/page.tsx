"use client";

import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { useFavStore } from "@/lib/store/favStore";
import { useAuth } from "@/context/authContext";
import { ProductCard } from "../_components/cards/ProductCard";


const FavPage = () => {
    const { items } = useFavStore();

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
        <div className="min-h-screen px-3 cursor-pointer">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                    <ProductCard key={item.id} product={item} />
                ))}
            </div>
        </div>
    );
};

export default FavPage;