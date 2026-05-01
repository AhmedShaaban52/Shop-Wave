"use client"

import { CrudModal } from '@/app/(dashboard)/_components/CrudModal';
import { useCrud } from '@/hooks/useCrud';
import { Category, Product, productSchema, ProductSchemaType } from '@/lib/types';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../actions';
import { useEffect, useState } from 'react';
import { getCategories } from '../../categories/actions';
import { DataTable } from '@/app/(dashboard)/_components/Table';
import { getColumns, getProductFields, PRODUCT_DEFAULTS } from '@/utils/ProductsFields';

export type ProductWithCategory = Product & {
    categories?: { id: string; name: string } | null;
};

const ProductsView = ({ initialData }: { initialData: Product[] }) => {
    const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string }[]>([]);
    const PRODUCT_FIELDS = getProductFields(categoryOptions);



    const {
        items: products,
        loading,
        isPending,
        editingItem,
        setEditingItem,
        showCreateModal,
        setShowCreateModal,
        handleCreate,
        handleUpdate,
        handleDelete,
    } = useCrud<ProductWithCategory, ProductSchemaType>(
        {
            getAll: getProducts as () => Promise<{ success: boolean; data?: ProductWithCategory[]; error?: string }>,
            create: createProduct,
            update: updateProduct,
            delete: deleteProduct,
        },
        {
            created: "Product created!",
            updated: "Product updated!",
            deleted: "Product deleted!",
        },
        initialData
    );

    console.log(products);

    const columns = getColumns({ setEditingItem, handleDelete })

    useEffect(() => {
        getCategories().then((res) => {
            if (res.success && res.data) {
                setCategoryOptions(
                    (res.data as Category[]).map((cat) => ({
                        label: cat.name,
                        value: cat.id,
                    }))
                );
            }
        });
    }, []);

    return (
        <div className="bg-white flex-1 overflow-y-auto p-6  rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-sky-900 tracking-tight">
                    Products Management
                </h2>

                <CrudModal<ProductSchemaType>
                    title="Product"
                    description="Add a new product to your store."
                    schema={productSchema}
                    fields={PRODUCT_FIELDS}
                    defaultValues={PRODUCT_DEFAULTS}
                    uploadPath="products"
                    triggerLabel="New Product"
                    open={showCreateModal}
                    onOpenChange={setShowCreateModal}
                    isSubmitting={isPending}
                    onSubmit={handleCreate}
                />
            </div>

            <DataTable
                data={products}
                columns={columns}
                loading={loading}
                loadingMessage="Loading products..."
                emptyMessage="No products found"
                emptySubMessage="Create your first product to get started"
            />

            {editingItem && (
                <CrudModal<ProductSchemaType>
                    title="Edit Product"
                    schema={productSchema}
                    fields={PRODUCT_FIELDS}
                    defaultValues={PRODUCT_DEFAULTS}
                    uploadPath="products"
                    mode="edit"
                    initialData={{
                        id: editingItem.id,
                        name: editingItem.name,
                        categoryId: editingItem.categoryId,
                        price: Number(editingItem.price),
                        description: editingItem.description || "",
                        image: editingItem.image,
                        discountType: (editingItem.discountType as "percent" | "amount") || undefined,
                        discountValue: editingItem.discountValue ? Number(editingItem.discountValue) : undefined,
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
    )
}

export default ProductsView

