import { getProductById } from "@/app/(dashboard)/admin/products/actions";
import { ArrowLeft, Star, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import Link from "next/link";
import { ProductCartWrapper } from "../../_components/ProductCartWrapper";
import { ProductImageGallery } from "../../_components/ProductImageGallery";

export default async function ProductDetailsPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const response = await getProductById(id);
    const product = response.data;

    // معالجة الخطأ إذا لم يتم العثور على المنتج
    if (!response.success || !product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-black text-slate-300 uppercase tracking-widest">PRODUCT NOT FOUND</h1>
                <Link href="/" className="text-[#00628c] font-bold hover:underline">Return to Shop</Link>
            </div>
        );
    }

    const categoryName = Array.isArray(product.categories) && product.categories.length > 0
        ? product.categories[0].name
        : "Azure Signature Series";

    return (
        <div className="min-h-screen bg-[#f4f7fa] pb-20 font-sans">
            <div className="max-w-[1300px] mx-auto px-4 md:px-10 py-10">

                <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-[#00628c] font-bold text-xs mb-10 transition-colors tracking-widest uppercase">
                    <ArrowLeft className="w-4 h-4" /> Back to Shop
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* استدعاء معرض الصور التفاعلي بالبيانات الديناميكية */}
                    <ProductImageGallery
                        mainImage={product.image}
                        thumbnails={product.thumbnails}
                        name={product.name}
                    />

                    {/* معلومات المنتج */}
                    <div className="lg:col-span-5 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-white self-start">
                        <div className="flex flex-col">
                            <span className="text-[#00628c] font-black uppercase tracking-[0.2em] text-[11px] mb-4">
                                {categoryName}
                            </span>

                            <h1 className="text-4xl md:text-5xl font-black text-[#0c314e] leading-tight mb-4 tracking-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-3 mb-8">
                                <div className="flex text-[#b18b4e]">
                                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} fill="currentColor" />)}
                                </div>
                                <span className="text-slate-400 text-xs font-bold">(128 Reviews)</span>
                            </div>

                            <p className="text-slate-500 leading-relaxed text-base mb-10 font-medium">
                                {product.description}
                            </p>

                            <div className="space-y-4 mb-10">
                                <div className="flex items-center gap-3 text-[#0c314e] font-bold text-xs">
                                    <div className="bg-[#e0f2fe] p-1.5 rounded-full"><Truck size={14} /></div>
                                    Express Shipping Available
                                </div>
                                <div className="flex items-center gap-3 text-[#0c314e] font-bold text-xs">
                                    <div className="bg-[#e0f2fe] p-1.5 rounded-full"><ShieldCheck size={14} /></div>
                                    2 Year International Warranty
                                </div>
                            </div>

                            <div className="bg-[#f8fafc] p-6 rounded-3xl mb-10 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Exclusive Price</p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl font-black text-[#0c314e]">${parseFloat(product.price).toFixed(2)}</span>
                                        {product.discountValue > 0 && (
                                            <span className="text-slate-300 line-through font-bold text-sm">
                                                ${(product.price + 50).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {product.discountValue > 0 && (
                                    <div className="bg-[#fcc1c1] text-[#b45454] px-3 py-1 rounded-lg text-[10px] font-black">
                                        {product.discountValue}% OFF
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6 pt-6 border-t border-slate-50">
                                <ProductCartWrapper product={product} />
                            </div>

                            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-slate-50">
                                <div className="text-center space-y-2">
                                    <Truck size={18} className="mx-auto text-sky-500" />
                                    <p className="text-[8px] font-black text-slate-400 uppercase">Free Shipping</p>
                                </div>
                                <div className="text-center space-y-2 border-x border-slate-100">
                                    <ShieldCheck size={18} className="mx-auto text-sky-500" />
                                    <p className="text-[8px] font-black text-slate-400 uppercase">2 Year Warranty</p>
                                </div>
                                <div className="text-center space-y-2">
                                    <RotateCcw size={18} className="mx-auto text-sky-500" />
                                    <p className="text-[8px] font-black text-slate-400 uppercase">30-Day Returns</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}