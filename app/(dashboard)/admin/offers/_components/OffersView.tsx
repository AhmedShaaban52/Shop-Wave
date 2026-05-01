"use client";

import { useCrud } from "@/hooks/useCrud";
import { Offer, offerSchema, OfferSchemaType } from "@/lib/types";
import { createOffer, deleteOffer, getOffers, updateOffer } from "../actions";
import { CrudModal } from "@/app/(dashboard)/_components/CrudModal";
import { DataTable } from "@/app/(dashboard)/_components/Table";
import { getOfferColumns, getOfferFields, OFFER_DEFAULTS } from "@/utils/OffersFields";


const OffersView = ({ initialData }: { initialData: Offer[] }) => {
    const {
        items: offers,
        loading,
        isPending,
        editingItem,
        setEditingItem,
        showCreateModal,
        setShowCreateModal,
        handleCreate,
        handleUpdate,
        handleDelete,
    } = useCrud<Offer, OfferSchemaType>(
        {
            getAll: getOffers,
            create: createOffer,
            update: updateOffer,
            delete: deleteOffer,
        },
        {
            created: "Offer created!",
            updated: "Offer updated!",
            deleted: "Offer deleted!",
        },
        initialData
    );

    const OFFER_FIELDS = getOfferFields();
    const columns = getOfferColumns({ setEditingItem, handleDelete });

    return (
        <div className="bg-white flex-1 overflow-y-auto p-6  rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-sky-900 tracking-tight">
                    Deals & Offers Management
                </h2>

                <CrudModal<OfferSchemaType>
                    title="Offer"
                    description="Add a new deal or promotional offer."
                    schema={offerSchema}
                    fields={OFFER_FIELDS}
                    defaultValues={OFFER_DEFAULTS}
                    uploadPath="offers"
                    triggerLabel="New Offer"
                    open={showCreateModal}
                    onOpenChange={setShowCreateModal}
                    isSubmitting={isPending}
                    onSubmit={handleCreate}
                />
            </div>

            <DataTable
                data={offers}
                columns={columns}
                loading={loading}
                loadingMessage="Loading offers..."
                emptyMessage="No offers found"
                emptySubMessage="Create your first deal or offer to get started"
            />

            {editingItem && (
                <CrudModal<OfferSchemaType>
                    title="Edit Offer"
                    schema={offerSchema}
                    fields={OFFER_FIELDS}
                    defaultValues={OFFER_DEFAULTS}
                    uploadPath="offers"
                    mode="edit"
                    initialData={{
                        ...editingItem,
                        description: editingItem.description || "",
                        startDate: editingItem.startDate
                            ? new Date(editingItem.startDate).toISOString().slice(0, 10)
                            : "",
                        endDate: editingItem.endDate
                            ? new Date(editingItem.endDate).toISOString().slice(0, 10)
                            : "",
                        createdAt: "",
                        updatedAt: "",
                    }}
                    open={!!editingItem}
                    onOpenChange={(open) => { if (!open) setEditingItem(null); }}
                    isSubmitting={isPending}
                    onSubmit={handleUpdate}
                    trigger={<></>}
                />
            )}
        </div>
    );
};

export default OffersView;