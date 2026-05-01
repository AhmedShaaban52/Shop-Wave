"use client"

import Image from 'next/image';
import { ImageIcon, Pencil } from 'lucide-react';
import { DeleteModal } from '@/app/(dashboard)/_components/DeleteModel';
import { ModalField, Offer, OfferSchemaType } from "@/lib/types";
import { getOfferStatus } from '@/lib/getOfferStatus';

const STATUS_COLORS: Record<string, string> = {
    active: "bg-green-100 text-green-700 border-green-200",
    inactive: "bg-red-100 text-red-700 border-red-200",
    upcoming: "bg-blue-100 text-blue-700 border-blue-200",
};


export const getOfferFields = (): ModalField[] => [
    {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Offer name",
        required: true,
    },
    {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Offer description",
    },
    {
        name: "discount",
        label: "Discount %",
        type: "number",
        placeholder: "e.g. 20",
        required: true,
        min: 1,
        max: 100,
        colSpan: 1,
    },
    {
        name: "image",
        label: "Image",
        type: "file",
        required: true,
        colSpan: 1,
    },
    {
        name: "startDate",
        label: "Start Date",
        type: "date",
        colSpan: 1,
    },
    {
        name: "endDate",
        label: "End Date",
        type: "date",
        colSpan: 1,
    },
];

interface GetColumnsProps {
    setEditingItem: (item: Offer) => void;
    handleDelete: (id: string) => Promise<void>;
}

export const getOfferColumns = ({ setEditingItem, handleDelete }: GetColumnsProps) => [
    {
        key: "image",
        label: "Image",
        render: (offer: Offer) => (
            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {offer.image ? (
                    <Image src={offer.image} alt={offer.name} width={48} height={48} className="object-cover w-full h-full" />
                ) : (
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                )}
            </div>
        ),
    },
    {
        key: "name",
        label: "Name",
        render: (offer: Offer) => (
            <span className="font-medium text-gray-800 whitespace-nowrap">{offer.name}</span>
        ),
    },
    {
        key: "discount",
        label: "Discount",
        align: "center" as const,
        render: (offer: Offer) => (
            <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                {offer.discount}% OFF
            </span>
        ),
    },
    {
        key: "status",
        label: "Status",
        align: "center" as const,
        render: (offer: Offer) => {
            const status = getOfferStatus(offer);
            return (
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${STATUS_COLORS[status]}`}>
                    {status}
                </span>
            );
        },
    },
    {
        key: "dates",
        label: "Validity",
        render: (offer: Offer) => {
            const start = offer.startDate ? new Date(offer.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Anytime";
            const end = offer.endDate ? new Date(offer.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Forever";
            return <p className="text-xs text-gray-500">{start} - {end}</p>;
        },
    },
    {
        key: "created_at",
        label: "Created Date",
        render: (offer: Offer) =>
            new Date(offer.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    },
    {
        key: "update_at",
        label: "Update Date",
        render: (offer: Offer) =>
            new Date(offer.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    },
    {
        key: "actions",
        label: "Actions",
        align: "center" as const,
        render: (offer: Offer) => (
            <div className="flex justify-center items-center gap-2">
                <button
                    onClick={() => setEditingItem(offer)}
                    className="p-1.5 rounded-md text-sky-600 hover:text-sky-800 hover:bg-sky-50 transition-all cursor-pointer"
                >
                    <Pencil className="h-4 w-4" />
                </button>
                <DeleteModal
                    itemName={offer.name}
                    onDelete={async () => await handleDelete(offer.id)}
                />
            </div>
        ),
    },
];

export const OFFER_DEFAULTS: OfferSchemaType = {
    name: "",
    description: "",
    image: "",
    discount: 0,
    startDate: "",
    endDate: "",
};