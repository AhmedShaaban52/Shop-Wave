"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, Loader2, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import debounce from "lodash.debounce";
import { searchProducts } from "@/app/(dashboard)/admin/products/actions";
import { ProductWithCategory } from "@/utils/ProductsFields";

const Search = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ProductWithCategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchResults = useCallback(
        debounce(async (searchQuery: string) => {
            if (searchQuery.length < 2) {
                setResults([]);
                return;
            }
            setIsLoading(true);
            const { data } = await searchProducts(searchQuery);
            if (data) setResults(data.slice(0, 5));
            setIsLoading(false);
        }, 300),
        []
    );

    useEffect(() => {
        fetchResults(query);
    }, [query, fetchResults]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (query.trim()) {
            router.push(`/products?q=${encodeURIComponent(query.trim())}`);
            setIsFocused(false);
        }
    };

    return (
        <div className="relative z-[110]" ref={dropdownRef}>
            <form
                onSubmit={handleSearchSubmit}
                className={`relative w-80`}
            >
                <div className={`relative  flex items-center bg-gray-50/50 border rounded-full px-4 py-2.5 transition-all duration-300 ${isFocused
                    ? "border-sky-400 ring-4 ring-sky-50 bg-white"
                    : "border-gray-100 hover:border-gray-200"
                    }`}>
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
                    ) : (
                        <SearchIcon className={`h-4 w-4 transition-colors ${isFocused ? "text-sky-500" : "text-gray-400"}`} />
                    )}

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        placeholder="Search products..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm ml-2 placeholder:text-gray-400 text-gray-700 outline-none"
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="h-3.5 w-3.5 text-gray-400" />
                        </button>
                    )}
                </div>
            </form>

            {isFocused && (query.length >= 2) && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-[120] animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-2">
                        {results.length > 0 ? (
                            <>
                                <div className="px-3 py-2 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quick Results</span>
                                    <span className="text-[10px] text-sky-500 font-medium">{results.length} items found</span>
                                </div>
                                <div className="space-y-1">
                                    {results.map((product) => (
                                        <button
                                            key={product.id}
                                            onClick={() => {
                                                router.push(`/products?q=${encodeURIComponent(product.name)}`);
                                                setIsFocused(false);
                                            }}
                                            className="w-full flex items-center gap-3 p-2.5 hover:bg-sky-50/50 rounded-xl transition-all group text-left"
                                        >
                                            <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-50">
                                                <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-700 truncate group-hover:text-sky-600 transition-colors">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-gray-400 font-semibold mt-0.5">
                                                    ${Number(product.price).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 shadow-sm transition-all -translate-x-2 group-hover:translate-x-0">
                                                <ArrowRight className="h-4 w-4 text-sky-500" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleSearchSubmit()}
                                    className="w-full mt-2 p-3 bg-gray-50 hover:bg-sky-600 hover:text-white text-gray-600 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    View all results for "{query}"
                                </button>
                            </>
                        ) : !isLoading && (
                            <div className="p-10 text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-3">
                                    <SearchIcon className="h-5 w-5 text-gray-300" />
                                </div>
                                <p className="text-sm text-gray-500 font-medium">No products found for "{query}"</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;