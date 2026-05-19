"use client";

import { useCrud } from "@/hooks/useCrud";
import { CrudModal } from "@/app/(dashboard)/_components/CrudModal";
import { DataTable } from "@/app/(dashboard)/_components/Table";
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from "@/lib/actions/couponActions";
import { couponSchema, CouponSchemaType } from "@/lib/types";
import { getCouponColumns, getCouponFields, COUPON_DEFAULTS } from "@/utils/CouponsFields";

export default function CouponsView({ initialData }: { initialData: any[] }) {
    const {
        items: coupons, loading, isPending,
        editingItem, setEditingItem,
        showCreateModal, setShowCreateModal,
        handleCreate, handleUpdate, handleDelete,
    } = useCrud(
        { getAll: getCoupons, create: createCoupon, update: updateCoupon, delete: deleteCoupon },
        { created: "Coupon created!", updated: "Coupon updated!", deleted: "Coupon deleted!" },
        initialData
    );

    const columns = getCouponColumns({ setEditingItem, handleDelete });
    const fields = getCouponFields();

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-sky-900 tracking-tight">Coupons Management</h2>
                    <p className="text-sm text-gray-400 mt-0.5">{coupons.length} coupons total</p>
                </div>
                <CrudModal
                    title="Coupon"
                    description="Create a new discount coupon for your customers."
                    schema={couponSchema}
                    fields={fields}
                    defaultValues={COUPON_DEFAULTS}
                    triggerLabel="New Coupon"
                    open={showCreateModal}
                    onOpenChange={setShowCreateModal}
                    isSubmitting={isPending}
                    onSubmit={handleCreate}
                />
            </div>

            <DataTable
                data={coupons}
                columns={columns}
                loading={loading}
                loadingMessage="Loading coupons..."
                emptyMessage="No coupons found"
                emptySubMessage="Create your first coupon to start offering discounts"
            />

            {editingItem && (
                <CrudModal
                    title="Edit Coupon"
                    schema={couponSchema}
                    fields={fields}
                    defaultValues={COUPON_DEFAULTS}
                    mode="edit"
                    initialData={{
                        id: (editingItem as any).id,
                        code: (editingItem as any).code,
                        discountType: (editingItem as any).discountType,
                        discountValue: parseFloat((editingItem as any).discountValue),
                        minOrderAmount: parseFloat((editingItem as any).minOrderAmount || "0"),
                        maxUses: (editingItem as any).maxUses || undefined,
                        startDate: (editingItem as any).startDate
                            ? new Date((editingItem as any).startDate).toISOString().slice(0, 10)
                            : "",
                        endDate: (editingItem as any).endDate
                            ? new Date((editingItem as any).endDate).toISOString().slice(0, 10)
                            : "",
                        isActive: (editingItem as any).isActive === false ? "false" : "true",
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
}