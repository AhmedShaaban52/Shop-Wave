import { searchProducts } from "@/app/(dashboard)/admin/products/actions";
import { getCategories } from "@/app/(dashboard)/admin/categories/actions";
import { ProductCard } from "../_components/cards/ProductCard";
import { ShoppingBag } from "lucide-react";
import { FilterSection } from "../_components/Filters";
import { Category } from "@/lib/types";

export default async function ProductsPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string; category?: string }>
}) {
    const params = await searchParams;
    const [{ data: products }, { data: categories }] = await Promise.all([
        searchProducts(params.q || "", params.category),  
        getCategories(),
    ]);

    const filteredProducts = products || [];

    const categoryOptions = [
        "All",
        ...((categories || []).map((c: Category) => c.name)),
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-8">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#0c314e] tracking-tight">
                            {params.q ? `Search results for "${params.q}"` : "All Products"}
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium">
                            Showing {filteredProducts.length} products
                            {params.category && params.category !== "All" && ` in ${params.category}`}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">

                    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
                        <FilterSection
                            title="Categories"
                            options={categoryOptions}
                            paramName="category"
                        />

                        <div className="bg-gradient-to-br from-[#00628c] to-[#003d58] rounded-3xl p-6 text-white shadow-xl shadow-blue-100">
                            <h4 className="font-black text-lg uppercase">Wave Club</h4>
                            <p className="text-xs mt-2 opacity-80">Join today and get free shipping.</p>
                            <button className="mt-5 w-full py-3 bg-white text-[#00628c] rounded-xl text-[10px] font-black uppercase shadow-lg">
                                Learn More
                            </button>
                        </div>
                    </aside>

                    <main className="flex-1">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border border-dashed border-slate-200">
                                <ShoppingBag className="w-8 h-8 text-slate-300 mb-6" />
                                <h2 className="text-xl font-bold text-slate-800">No products found</h2>
                                <p className="text-slate-400 mt-2 text-sm text-center">
                                    Try changing your search or filters.
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}