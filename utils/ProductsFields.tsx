"use client"

import { DeleteModal } from '@/app/(dashboard)/_components/DeleteModel';
import { calculatePrice } from '@/lib/calculatePrice';
import { ModalField, Product, ProductSchemaType } from "@/lib/types";
import { ImageIcon, Pencil } from 'lucide-react';
import Image from 'next/image';

export type ProductWithCategory = Product & {
    categories?: { id: string; name: string } | null;
};

export const getProductFields = (
    categoryOptions: { label: string; value: string }[],
): ModalField[] => [
        {
            name: "name",
            label: "Product Name",
            type: "text",
            placeholder: "Product name",
            required: true
        },
        {
            name: "description",
            label: "Description",
            type: "textarea",
            placeholder: "Product description"
        },
        {
            name: "categoryId",
            label: "Category",
            type: "select",
            placeholder: "Select a category",
            required: true,
            options: categoryOptions
        },
        {
            name: "price",
            label: "Price ($)",
            type: "number",
            placeholder: "0.00",
            required: true,
            min: 0, colSpan: 1
        },
        {
            name: "discountType",
            label: "Discount Type",
            type: "select",
            placeholder: "No discount",
            colSpan: 1,
            options: [{ label: "Percent (%)", value: "percent" }, { label: "Amount ($)", value: "amount" }]
        },
        {
            name: "discountValue",
            label: "Discount Value",
            type: "number",
            placeholder: "0",
            min: 0, colSpan: 1
        },
        {
            name: "image",
            label: "Image",
            type: "file",
            required: true,
            colSpan: 1
        },
        {
            name: "isActive",
            label: "Status",
            type: "select",
            colSpan: 1,
            options: [{ label: "Active", value: "true" },
            { label: "Inactive", value: "false" }]
        },
    ];

interface GetColumnsProps {
    setEditingItem: (item: ProductWithCategory) => void;
    handleDelete: (id: string) => Promise<void>;
}

export const getColumns = ({ setEditingItem, handleDelete }: GetColumnsProps) => [
    {
        key: "image",
        label: "Image",
        render: (p: ProductWithCategory) => (
            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {p.image ? (
                    <Image src={p.image} alt={p.name} width={48} height={48} className="object-cover w-full h-full" />
                ) : (
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                )}
            </div>
        ),
    },
    {
        key: "name",
        label: "Name",
        render: (p: ProductWithCategory) => (
            <p className="font-medium text-gray-800 whitespace-nowrap">{p?.name}</p>
        ),
    },
    {
        key: "description",
        label: "Description",
        render: (p: ProductWithCategory) => (
            <p className="line-clamp-2 text-gray-800 max-w-md text-sm">{p?.description}</p>
        ),
    },
    {
        key: "category",
        label: "Category",
        render: (p: ProductWithCategory) => (
            <p className="font-medium text-gray-800">{p.categories?.name}</p>
        ),
    },
    {
        key: "original_price",
        label: "Original Price",
        align: "center" as const,
        render: (p: ProductWithCategory) => {
            const original = parseFloat(p.price as string).toFixed(2);
            return <p className="font-bold text-gray-800">${original}</p>;
        },
    },
    {
        key: "final_price",
        label: "Final Price",
        align: "center" as const,
        render: (p: ProductWithCategory) => {
            const finalPrice = calculatePrice(p);
            const original = parseFloat(p.price as string).toFixed(2);
            return (
                <p className="font-bold text-gray-800">
                    ${finalPrice !== null ? finalPrice.toFixed(2) : original}
                </p>
            );
        },
    },
    {
        key: "discount",
        label: "Discount",
        align: "center" as const,
        render: (p: ProductWithCategory) => {
            if (!p.discountType || !p.discountValue) return <span className="italic text-gray-300 text-sm">—</span>;
            const symbol = p.discountType === "percent" ? "%" : "$";
            const colorClass = p.discountType === "percent" ? "bg-green-100 text-green-700" : "bg-sky-100 text-sky-700";
            return (
                <span className={`inline-flex rounded-full text-xs font-bold border ${colorClass}`}>
                    -{parseFloat(p.discountValue as string).toFixed(0)}<span className='pl-0.5'>{symbol}</span>
                </span>
            );
        },
    },
    {
        key: "status",
        label: "Status",
        align: "center" as const,
        render: (p: ProductWithCategory) => {
            const active = (p as any).isActive !== false;
            return (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border ${active ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-600 border-red-200"
                    }`}>
                    {active ? "Active" : "Inactive"}
                </span>
            );
        },
    },
    {
        key: "created_at",
        label: "Created",
        render: (p: ProductWithCategory) =>
            new Date(p.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    },
    {
        key: "actions",
        label: "Actions",
        align: "center" as const,
        render: (p: ProductWithCategory) => (
            <div className="flex justify-center items-center gap-2">
                <button
                    onClick={() => setEditingItem(p)}
                    className="p-1.5 rounded-md text-sky-600 hover:text-sky-800 hover:bg-sky-50 transition-all cursor-pointer"
                >
                    <Pencil className="h-4 w-4" />
                </button>
                <DeleteModal itemName={p.name} onDelete={() => handleDelete(p.id)} />
            </div>
        ),
    },
];

export const PRODUCT_DEFAULTS: ProductSchemaType = {
    categoryId: "",
    name: "",
    description: "",
    image: "",
    price: 0,
    discountType: undefined,
    discountValue: undefined,
    isActive: "true",
};