"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import { DataTable } from "@/app/(dashboard)/_components/Table";
import { DeleteModal } from "@/app/(dashboard)/_components/DeleteModel";
import { toast } from "sonner";
import { deleteOrder, getAllOrders, updateOrderStatus } from "../actions";

export default function OrdersView({ initialData }: { initialData: any[] }) {
    const [orders, setOrders] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        const { data } = await getAllOrders();
        setOrders(data || []);
        setLoading(false);
    };

    // const handleStatusChange = async (id: string, status: string) => {
    //     const result = await updateOrderStatus(id, status);
    //     if (result.success) {
    //         toast.success("Status updated!");
    //         await fetchOrders();
    //     } else {
    //         toast.error("Failed to update status");
    //     }
    // };

    const handleDelete = async (id: string) => {
        const result = await deleteOrder(id);
        if (result.success) {
            toast.success("Order deleted!");
            await fetchOrders();
        } else {
            toast.error("Failed to delete order");
        }
    };

    // const STATUS_OPTIONS = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

    const STATUS_STYLES: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
        paid: "bg-green-100 text-green-700 border-green-200",
        processing: "bg-blue-100 text-blue-700 border-blue-200",
        shipped: "bg-purple-100 text-purple-700 border-purple-200",
        delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
        cancelled: "bg-red-100 text-red-600 border-red-200",
    };

    const columns = [
        {
            key: "id",
            label: "Order ID",
            render: (o: any) => (
                <span className="font-mono text-xs text-gray-500">
                    #{o.stripe_session_id?.slice(-8).toUpperCase()}
                </span>
            ),
        },
        {
            key: "user",
            label: "User ID",
            render: (o: any) => (
                <span className="text-xs text-gray-500 font-mono">
                    {o.user_id?.slice(0, 8)}...
                </span>
            ),
        },
        {
            key: "items",
            label: "Items",
            align: "center" as const,
            render: (o: any) => (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-sky-700 rounded-full text-xs font-bold">
                    <Package className="w-3 h-3" />
                    {o.order_items?.length || 0}
                </span>
            ),
        },
        {
            key: "total",
            label: "Total",
            align: "center" as const,
            render: (o: any) => (
                <span className="font-black text-gray-800">${parseFloat(o.total).toFixed(2)}</span>
            ),
        },
        // {
        //     key: "status",
        //     label: "Status",
        //     align: "center" as const,
        //     render: (o: any) => (
        //         <select
        //             value={o.status}
        //             onChange={(e) => handleStatusChange(o.id, e.target.value)}
        //             className={`text-xs font-bold px-2 py-1 rounded-full border cursor-pointer outline-none ${STATUS_STYLES[o.status] || STATUS_STYLES.pending}`}
        //         >
        //             {STATUS_OPTIONS.map(s => (
        //                 <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
        //             ))}
        //         </select>
        //     ),
        // },
        {
            key: "status",
            label: "Status",
            align: "center" as const,
            render: (o: any) => (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${STATUS_STYLES[o.status] || STATUS_STYLES.pending}`}>
                    {o.status?.charAt(0).toUpperCase() + o.status?.slice(1)}
                </span>
            ),
        },
        {
            key: "date",
            label: "Date",
            render: (o: any) => (
                <span className="text-xs text-gray-500">
                    {new Date(o.created_at).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric"
                    })}
                </span>
            ),
        },
        {
            key: "details",
            label: "Items",
            align: "center" as const,
            render: (o: any) => (
                <button
                    onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}
                    className="p-1.5 rounded-md text-sky-600 hover:bg-sky-50 transition-all cursor-pointer flex items-center gap-1 text-xs font-medium"
                >
                    {expandedOrder === o.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    View
                </button>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            align: "center" as const,
            render: (o: any) => (
                <DeleteModal
                    itemName={`Order #${o.stripe_session_id?.slice(-8).toUpperCase()}`}
                    onDelete={() => handleDelete(o.id)}
                />
            ),
        },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-sky-900 tracking-tight">
                    Orders Management
                </h2>
                <span className="text-sm text-gray-400 font-medium">
                    {orders.length} orders
                </span>
            </div>

            <DataTable
                data={orders}
                columns={columns}
                loading={loading}
                loadingMessage="Loading orders..."
                emptyMessage="No orders found"
                emptySubMessage="Orders will appear here after customers checkout"
            />

            {/* Expanded Order Items */}
            {expandedOrder && (() => {
                const order = orders.find(o => o.id === expandedOrder);
                if (!order?.order_items?.length) return null;
                return (
                    <div className="mt-4 p-4 bg-sky-50 rounded-xl border border-sky-100">
                        <p className="text-xs font-black text-sky-900 uppercase tracking-wider mb-3">
                            Order Items — #{order.stripe_session_id?.slice(-8).toUpperCase()}
                        </p>
                        <div className="flex flex-col gap-2">
                            {order.order_items.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-sky-100">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={40}
                                            height={40}
                                            className="object-cover w-full h-full"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-800">{item.name}</p>
                                        <p className="text-xs text-gray-400">
                                            {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                                        </p>
                                    </div>
                                    <span className="font-black text-sky-700 text-sm">
                                        ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}