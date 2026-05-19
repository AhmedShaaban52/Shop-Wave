"use client";

import { Pencil } from "lucide-react";
import { DeleteModal } from "@/app/(dashboard)/_components/DeleteModel";
import { ModalField, Coupon, CouponSchemaType } from "@/lib/types";

export const getCouponFields = (): ModalField[] => [
    { name: "code", label: "Coupon Code", type: "text", placeholder: "e.g. SAVE20", required: true },
    {
        name: "discountType", label: "Discount Type", type: "select", required: true, colSpan: 1,
        options: [{ label: "Percent (%)", value: "percent" }, { label: "Amount ($)", value: "amount" }]
    },
    { name: "discountValue", label: "Discount Value", type: "number", placeholder: "0", min: 0, required: true, colSpan: 1 },
    { name: "minOrderAmount", label: "Min Order ($)", type: "number", placeholder: "0", min: 0, colSpan: 1 },
    { name: "maxUses", label: "Max Uses", type: "number", placeholder: "Unlimited", min: 1, colSpan: 1 },
    { name: "startDate", label: "Start Date", type: "date", colSpan: 1 },
    { name: "endDate", label: "End Date", type: "date", colSpan: 1 },
    {
        name: "isActive", label: "Status", type: "select", colSpan: 1,
        options: [{ label: "Active", value: "true" }, { label: "Inactive", value: "false" }]
    },
];

interface GetColumnsProps {
    setEditingItem: (item: Coupon) => void;
    handleDelete: (id: string) => Promise<void>;
}

export const getCouponColumns = ({ setEditingItem, handleDelete }: GetColumnsProps) => [
    {
        key: "code", label: "Code",
        render: (c: any) => (
            <span className="font-mono font-black text-sky-700 bg-sky-50 px-2 py-1 rounded-lg text-sm">
                {c.code}
            </span>
        ),
    },
    {
        key: "discount", label: "Discount", align: "center" as const,
        render: (c: any) => {
            const colorClass = c.discountType === "percent" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700";
            return (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${colorClass}`}>
                    {c.discountType === "percent" ? `${c.discountValue}%` : `$${c.discountValue}`} OFF
                </span>
            );
        },
    },
    {
        key: "min_order", label: "Min Order", align: "center" as const,
        render: (c: any) => (
            <span className="text-sm text-gray-600">
                {parseFloat(c.minOrderAmount) > 0 ? `$${c.minOrderAmount}` : "—"}
            </span>
        ),
    },
    {
        key: "usage", label: "Usage", align: "center" as const,
        render: (c: any) => (
            <span className="text-sm text-gray-600">
                {c.usedCount} / {c.maxUses ?? "∞"}
            </span>
        ),
    },
    {
        key: "validity", label: "Validity",
        render: (c: any) => {
            const start = c.startDate ? new Date(c.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Anytime";
            const end = c.endDate ? new Date(c.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Forever";
            return <span className="text-xs text-gray-500">{start} → {end}</span>;
        },
    },
    {
        key: "status", label: "Status", align: "center" as const,
        render: (c: any) => (
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${c.isActive ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-600 border-red-200"}`}>
                {c.isActive ? "Active" : "Inactive"}
            </span>
        ),
    },
    {
        key: "actions", label: "Actions", align: "center" as const,
        render: (c: any) => (
            <div className="flex justify-center items-center gap-2">
                <button onClick={() => setEditingItem(c)} className="p-1.5 rounded-md text-sky-600 hover:bg-sky-50 cursor-pointer">
                    <Pencil className="h-4 w-4" />
                </button>
                <DeleteModal itemName={c.code} onDelete={() => handleDelete(c.id)} />
            </div>
        ),
    },
];

export const COUPON_DEFAULTS: CouponSchemaType = {
    code: "",
    discountType: "percent",
    discountValue: 0,
    minOrderAmount: 0,
    isActive: "true",
    startDate: "",
    endDate: "",
};