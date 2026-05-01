"use client"

import Image from 'next/image';
import { ImageIcon, Pencil } from 'lucide-react';
import { DeleteModal } from '@/app/(dashboard)/_components/DeleteModel';
import { ModalField, Category, CategorySchemaType } from "@/lib/types";

export const getCategoryFields = (): ModalField[] => [
    {
        name: "name",
        label: "Category Name",
        type: "text",
        placeholder: "e.g. Pizza, Burgers",
        required: true
    },
    {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Category description"
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
        options: [{ label: "Active", value: "true" }, { label: "Inactive", value: "false" }]
    },
];

interface GetColumnsProps {
    setEditingItem: (item: Category) => void;
    handleDelete: (id: string) => Promise<void>;
}

export const getCategoryColumns = ({ setEditingItem, handleDelete }: GetColumnsProps) => [
    {
        key: "image",
        label: "Image",
        render: (cat: Category) => (
            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {cat.image ? (
                    <Image src={cat.image} alt={cat.name} width={48} height={48} className="object-cover w-full h-full" />
                ) : (
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                )}
            </div>
        ),
    },
    {
        key: "name",
        label: "Name",
        render: (cat: Category) => (
            <span className="font-medium text-gray-800 whitespace-nowrap">{cat.name}</span>
        ),
    },
    {
        key: "description",
        label: "Description",
        render: (cat: Category) => (
            <div className="line-clamp-2 text-gray-500 max-w-xs text-sm">
                {cat.description || <span className="italic text-gray-300">—</span>}
            </div>
        ),
    },
    {
        key: "status",
        label: "Status",
        align: "center" as const,
        render: (cat: Category) => {
            const active = cat.isActive !== false;
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
        label: "Created Date",
        render: (cat: Category) =>
            new Date(cat.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    },
    {
        key: "updated_at",
        label: "Updated Date",
        render: (cat: Category) =>
            new Date(cat.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    },
    {
        key: "actions",
        label: "Actions",
        align: "center" as const,
        render: (cat: Category) => (
            <div className="flex justify-center items-center gap-2">
                <button
                    onClick={() => setEditingItem(cat)}
                    className="p-1.5 rounded-md text-sky-600 hover:text-sky-800 hover:bg-sky-50 transition-all cursor-pointer"
                >
                    <Pencil className="h-4 w-4" />
                </button>
                <DeleteModal itemName={cat.name} onDelete={async () => await handleDelete(cat.id)} />
            </div>
        ),
    },
];

export const CATEGORY_DEFAULTS: CategorySchemaType = {
    name: "",
    description: "",
    image: "",
    isActive: "true",
};