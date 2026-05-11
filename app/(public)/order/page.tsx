import { getUserOrders } from "@/lib/actions/checkoutActions";
import { Package, CheckCircle2, Clock, ChevronRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function OrdersPage({ params }: { params: Promise<{ id: string }> }) {
    await params;

    const response = await getUserOrders();
    const orders = response.data || [];

    return (
        <div className="min-h-screen bg-[#fcfdfe] pb-20">
            <div className="max-w-4xl mx-auto px-4 py-12" dir="rtl">
                <div className="mb-10 text-right">
                    <h1 className="text-3xl font-black text-[#0c314e] tracking-tight">Orders</h1>
                    <p className="text-slate-500 mt-2 font-medium">View and manage all your orders in Shop Wave</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-100 shadow-sm">
                        <div className="bg-sky-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Package className="text-sky-500" size={30} />
                        </div>
                        <h2 className="text-xl font-bold text-[#0c314e]">There are no previous requests</h2>
                        <Link href="/" className="mt-6 bg-[#00628c] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#004a6b] transition-all inline-block">
                            Explore products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order: any) => (
                            <div key={order.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:border-sky-100 transition-all">
                                <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-50 flex flex-row-reverse justify-between items-center gap-4">
                                    <div className="flex flex-row-reverse items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">the date</p>
                                            <p className="text-[#0c314e] font-bold text-sm">
                                                {new Date(order.created_at).toLocaleDateString('ar-EG')}
                                            </p>
                                        </div>
                                        <div className="text-right border-r pr-6 border-slate-200">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Total</p>
                                            <p className="text-[#0c314e] font-black text-sm">{order.total}EG</p>
                                        </div>
                                    </div>

                                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black ${order.status === 'paid' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                        }`}>
                                        {order.status === 'paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                        {order.status === 'paid' ? "paid" : "processing"}
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="flex flex-col gap-6">
                                        {order.order_items?.map((item: any) => (
                                            <div key={item.id} className="flex flex-row-reverse items-center gap-4 group/item">
                                                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 text-right">
                                                    <h4 className="text-[#0c314e] font-bold text-sm truncate">{item.name}</h4>
                                                    <p className="text-slate-400 text-xs font-medium">Quantity: {item.quantity} × {item.price} ج.م</p>
                                                </div>
                                                <Link href={`/product-details/${item.product_id}`} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                                                    <ChevronRight size={18} className="text-slate-300 rotate-180" />
                                                </Link>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-50 flex flex-row-reverse justify-between items-center">
                                        <p className="text-[10px] text-slate-300 font-mono">
                                            ID: {order.stripe_session_id?.slice(-10).toUpperCase()}
                                        </p>
                                        <button className="text-[#00628c] font-black text-xs uppercase flex items-center gap-2 hover:underline">
                                            <ExternalLink size={12} /> Order details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}